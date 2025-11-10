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
    const name=row.querySelector(".variant-name").value.trim();
    const price = parseFloat(row.querySelector(".variant-price").value) || 0;

    variants.push({name,price});
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
  localStorage.setItem(events,convert);

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

    

}

// removing variant row

document.getElementById('btn-add-variant').addEventListener('click', addVariantRow);
