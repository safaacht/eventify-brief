// Your app's data structure
let events = [];
let archive = [];


// ============================================
//      SCREEN SWITCHING
// ============================================

const sidebar = document.querySelectorAll('.sidebar__btn');
const screens = document.querySelectorAll(".screen");
const title = document.getElementById("page-title");
const subtitle = document.getElementById("page-subtitle");

let screenStatus  = [
    {action: "stats", title: "Statistics", subtitle: "Overview of your events"},
    {action: "add", title: "Add Event", subtitle: "Add a new event to your list"},
    {action: "list", title: "Events", subtitle: "See all your events"},
    {action: "archive", title: "Archive", subtitle: "Past events archive"}
];


function switchScreen(btn) {
    const target = btn.dataset.screen;

    //  Update screens visibility
    screens.forEach(screen => {
        screen.classList.toggle("is-visible", screen.dataset.screen === target);
    });

    //  Update sidebar active class
    sidebar.forEach(side => side.classList.remove("is-active"));
    btn.classList.add("is-active");

    //  Update title & subtitle using forEach
    screenStatus.forEach(item => {
        if (item.action === target) {
            title.textContent = item.title;
            subtitle.textContent = item.subtitle;
        }
    });
}

// Listen to sidebar button clicks
sidebar.forEach(btn => {
    btn.addEventListener("click", () => switchScreen(btn));
});


// ============================================
//          ADD EVENT FORM
// ============================================

function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('event-title').value.trim();
  const image = document.getElementById('event-image').value.trim();
  const description = document.getElementById('event-description').value.trim();
  const seats = parseInt(document.getElementById('event-seats').value);
  const price = parseFloat(document.getElementById('event-price').value);

  const errorBox = document.getElementById('form-errors');
  const errors = [];      // adding a new array to show all the erroes at once

  if (!title) errors.push("Event title is required.");
  if (isNaN(seats) || seats <= 0) errors.push("Seats must be a positive number.");
  if (isNaN(price) || price < 50) errors.push("Price must be  upper than 50.");

  // showing errors if there is any
  if (errors.length > 0) {
    errorBox.innerHTML = errors.join("<br>"); // display errors as lines
    errorBox.classList.remove("is-hidden");   // make error box visible
    return; 
  }

//   hidding errors if there is none
  errorBox.classList.add("is-hidden");
  errorBox.innerHTML = "";

//   variant
const variantRows = document.querySelectorAll("#variants-list .variant-row");
const variants = [];

for(let i=0; i<variantRows.length; i++){
    const row=variantRows[i];
    const name=row.querySelector(".variant-row__name").value.trim();
    const price = parseFloat(row.querySelector(".variant-row__value").value) || 0;
    const value=parseInt(row.querySelector(".variant-row__value").value) || 0;
    const qty=parseInt(row.querySelector(".variant-row__qty").value) || 1;
    const type=row.querySelector(".variant-row__type").value
    

    variants.push({name,price,value,qty,type});
    
}


// addint new object 
  const newEvent={
    id: events.length + 1,
    title,
    image,
    description,
    seats,
    price,
    variants,   
};
  
  events.push(newEvent);

  const convert=JSON.stringify(events);
  localStorage.setItem('events',convert);

  console.log("✅ Event created:", newEvent);
  // reseting the form
  e.target.reset();
 



}

document.getElementById('event-form').addEventListener('submit', handleFormSubmit)



// adding variant row
function addVariantRow(){

    const variantList = document.getElementById('variants-list');
    const template=variantList.querySelector('.variant-row'); // first row =template (if existing)

    if (!template) return;

    // cloning
    const newRow = template.cloneNode(true);

    const inputs = newRow.querySelectorAll('input');
    inputs.forEach(input => input.value = '');    // clearing the inputs

    // adding a remove button
    const removeBtn=newRow.querySelector(".variant-row__remove");
    if(removeBtn){
        removeBtn.addEventListener("click",()=>removeVariantRow(removeBtn))
    }


    variantList.appendChild(newRow);


}

// removing variant row
function removeVariantRow(button) {
    const row=button.closest('.variant-row');
    if(row) row.remove();
}

document.getElementById('btn-add-variant').addEventListener('click', addVariantRow);



// ============================================
//       EVENTS LIST SCREEN
// ============================================

function renderEventsTable(eventList,page = 1, perPage = 10) {
  const tbody = document.querySelector('#events-table tbody');
  tbody.innerHTML = '';    // to clear previous rows
  console.log("test")
    // pagination 

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const paginatedEvents = eventList.filter((_, index) => {
    return index >= start && index < end;
  });

console.log(paginatedEvents)
  paginatedEvents.forEach((event, index) => {
    const tr = document.createElement('tr');
    tr.classList.add('table__row');
    tr.dataset.eventId = event.id;      // storing the event’s ID in the DOM
    tr.innerHTML += `
      <td>${start + index + 1}</td>
      <td>${event.title}</td>
      <td>${event.seats}</td>
      <td>$${event.price.toFixed(2)}</td>
      <td><span class="badge">${event.variants ? event.variants.length : 0}</span></td>
      <td>
        <button class="btn btn--small" data-action="details" data-event-id="${event.id}">Details</button>
        <button class="btn btn--small" data-action="edit" data-event-id="${event.id}">Edit</button>
        <button class="btn btn--danger btn--small" data-action="archive" data-event-id="${event.id}">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

} 

document.addEventListener('DOMContentLoaded',()=>{
  // console.log(events);
  events = JSON.parse(localStorage.getItem('events'));
  renderEventsTable(events)
})

