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

// affichage des événements avec pagination

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
    tr.dataset.eventId = event.id;      // storing the event’s id in the DOM
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


// function renderPagination(totalItems, currentPage, perPage){

//   let totalPages=parseInt(totalItems/perPage);
//   if(totalItems%perPage!==0) totalPages++;   // 23%10=3 donc +1page

//   const pagination=document.getElementById('events-pagination');
//   pagination.innerHTML='' 

  // // previous button
  // const prevBtn=document.createElement('button');
  // prevBtn.textContent="Prev";
  // prevBtn.disabled = currentPage === 1;    // disactivation du btn si on est ds la 1er page
  // prevBtn.classList.toggle('is-disabled',currentPage===1);
  // prevBtn.addEventListener("click",()=>{
  //   if(currentPage>1) renderEventsTable(events,currentPage-1,perPage);
  // })
  // pagination.appendChild(prevBtn);



  // // next button
  // const nextBtn=document.createElement('button');
  // nextBtn.textContent="Next";
  // nextBtn.disabled = currentPage === totalPages;  
  // nextBtn.classList.toggle('is-disabled',currentPage===totalPages);
  // nextBtn.addEventListener('click',()=>{
  //   if(currentPage<totalPages) renderEventsTable(events,currentPage+1,perPage);
  // })
  // pagination.appendChild(nextBtn)

  // // num buttons
  // for (let i = 1; i <= totalPages; i++) {
  //   const btn = document.createElement("button");
  //   btn.textContent = i;
  //   btn.classList.toggle("is-active", i === currentPage);
  //   btn.addEventListener("click", () => renderEventsTable(events, i, perPage));
  //   pagination.appendChild(btn);
  // }
// }

function handleTableActionClick(e){
  // Checking if e.target is [data-action]
  const actionBtn=e.target.closest('[data-action]');
  if(!actionBtn) return;  // return if it's not an action btn

  const action=actionBtn.getAttribute('data-action');

  // recuperation de l’id d'evenement
  const eventId=actionBtn.closest('[data-event-id]')?.getAttribute('data-event-id'); 
  
  if (action === 'details') {
    showDetails(eventId);
   } 
   else if (action === 'edit') {
    editEvent(eventId);
   } 
   else if (action === 'delete') {
    archiveEvent(eventId);
  }
  
}
 document.getElementById('events-table').addEventListener('click', handleTableActionClick)

function showDetails(eventId){
  const id=parseInt(eventId);
  let event=null;

  // looking for the event by its id
  for (let i = 0; i < events.length; i++) {
    if (events[i].id === id) {
      event = events[i];
      break;
  }
 } 
  if(!event) return alert("Event not found!!!!");

  // remplissage du modale par son contenu
  const modalBody = document.getElementById("modal-body");
  console.log("yes")
  console.log(event)
  modalBody.innerHTML=`
  <h3>${event.title}</h3>
  <p><strong>Description :</strong> ${event.description}</p>
  <p><strong>Price :</strong> ${event.price}</p>
  <p><strong>Seats :</strong> ${event.seats}</p>
  <p><strong>Variant :</strong> ${event.variants.length} ${
      event.variants && event.variants.length > 0
        ? "<ul>" + event.variants.map(v => `<li> <b>Name:</b>${v.name} <b>Qty:</b>${v.qty} <b>Value:$</b>${v.value} (${v.type})</li>`).join("") + "</ul>"
        : "No variants"
    }</p>
  `;

  // affichage du modal

  const modal=document.getElementById("event-modal");
  modal.classList.remove("is-hidden");


  // fermeture de modale
  modal.addEventListener("click",function(e){
    const clicked=e.target;

    if(clicked.dataset.action==="close-modal" || clicked.classList.contains("modal__overlay")){
      modal.classList.add('is-hidden');
    }
  });


}


function editEvent(eventId){
  const id=parseInt(eventId);
  let event=null;

  // looking for the event by its id
  for (let i = 0; i < events.length; i++) {
    if (events[i].id === id) {
      event = events[i];
      break;
  }
 } 
  if(!event) return alert("Event not found!!!!");

  document.getElementById("event-title").value=event.title;
  document.getElementById("event-description").value = event.description; 
  document.getElementById("event-seats").value=event.seats;
  document.getElementById("event-price").value=event.price;
  document.querySelector(".variant-row").value=event.variantRows;
  
  // fonction qui affiche les modifs
  switchScreen("add"); 

  const form=document.getElementById("event-form");
  form.onsubmit=function(e){
    e.preventDefault;

// updating infos
    event.title = document.getElementById("event-title").value;
    event.description=document.getElementById("event-description").value;
    event.seats=document.getElementById("event-seats").value;
    event.price=document.getElementById("event-price").value;
    event.variantRows=document.querySelector(".variant-row").value;

    alert("Infos had been updated succesfully!");
    renderEventsTable(events);
    switchScreen("liste");   // revenir a la list
    

  }

}


function archiveEvent(eventId) {
  let archivedEvent = null;

  //  retirage d'evenement en meme temps qu’on verifie s’il existe
  const newEvents = events.filter(ev => {
    if (ev.id == eventId) {
      archivedEvent = ev;   // event trouvé 
      return false;         // donc on ne le garde pas
    }
    return true;            // on garde les autres
  });

  //  if ntg was found
  if (!archivedEvent) {
    alert("Événement introuvable");
    return;
  }

  //  archiver
  archive.push(archivedEvent);

  // updating the list
  events = newEvents;

  // sauvegarder en localStorage
  localStorage.setItem("events", JSON.stringify(events));
  localStorage.setItem("archive", JSON.stringify(archive));

  renderEventsTable(events);

  alert("Événement archivé !");
}



// ============================================
//          SEARCH & SORT
// ============================================
function searchEvents(query) {
  const qry = query.toLowerCase().trim();
  return events.filter(e => e.title.toLowerCase().includes(qry));
}


function sortEvents(eventList, sortType) {
  const sorted = [...eventList]; // cree une autre copie pour ne pas modifier l'original(spreed)
  const n = sorted.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      let swap = false;

      switch (sortType) {
        case "title-asc":
          if (sorted[j].title.toLowerCase() > sorted[j + 1].title.toLowerCase()) swap = true;
          break;
        case "title-desc":
          if (sorted[j].title.toLowerCase() < sorted[j + 1].title.toLowerCase()) swap = true;
          break;
        case "price-asc":
          if (sorted[j].price > sorted[j + 1].price) swap = true;
          break;
        case "price-desc":
          if (sorted[j].price < sorted[j + 1].price) swap = true;
          break;
        case "seats-asc":
          if (sorted[j].seats > sorted[j + 1].seats) swap = true;
          break;
        default:
          console.warn("Sort type non reconnu :", sortType);
      }

      if (swap) {
        const temp = sorted[j];
        sorted[j] = sorted[j + 1];
        sorted[j + 1] = temp;
      }
    }
  }

  return sorted;
}

// Listen to search and sort changes
document.getElementById('search-events').addEventListener('input', (e) => { 
    const filtered = searchEvents(e.target.value); 
    renderEventsTable(filtered); 
});


document.getElementById("sort-events").addEventListener("change", (e)=> {
 events =  sortEvents(events, e.target.value)
 renderEventsTable(sordtedArr);
  
})



// ============================================
//       ARCHIVE SCREEN
// ============================================
// 
function renderArchiveTable(archivedList) {

  const tbody = document.querySelector("#archive-table");
  tbody.innerHTML = "";

  archivedList.forEach(event => {
    const row = document.createElement("tr");
    row.dataset.eventId = event.id;

    row.innerHTML = `
      <td>${event.title}</td>
      <td>${event.description}</td>
      <td>${event.seats}</td>
      <td>${event.price}</td>
      <td>${event.variants}</td>
      <td>
        <button class="btn btn-restore" data-action="restore" data-id="${event.id}">
          Restore
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}



function restoreEvent(eventId) {

  eventId = Number(eventId);

  let restoredEvent = null;
  let indexToRemove = -1;

  //  chercher l'evenement dans archive par son id
  for (let i = 0; i < archive.length; i++) {
    if (archive[i].id === eventId) {
      restoredEvent = archive[i];
      indexToRemove = i;
      break; 
    }
  }

  if (!restoredEvent) return; 

  
  events.push(restoredEvent);    // restoring to event

  // garder uniquement les evenements dont l’id est different de eventId
  archive = archive.filter(event => event.id !== eventId);


  
  saveData();   // sauvgarder en localStorage
  renderEventsTable(events);
  renderArchiveTable(archive);
}


function saveData() {
  localStorage.setItem("events", JSON.stringify(events));
  localStorage.setItem("archive", JSON.stringify(archive));
}


//delegation des evenement
document.addEventListener("click", function (e) {
  if (e.target.dataset.action === "restore") {
    const id = e.target.dataset.id;
    restoreEvent(id);
  }
});




// ============================================
//      STATISTICS SCREEN
// ============================================


function renderStats() {
// calculating from events array
    const totalEvents = events.length;
    const totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
    const totalPrice = events.reduce((sum, e) => sum + e.price * e.seats, 0);
    
    // Update DOM
    document.getElementById('stat-total-events').textContent = totalEvents;
    document.getElementById('stat-total-seats').textContent = totalSeats;
    document.getElementById('stat-total-price').textContent = '$' + totalPrice.toFixed(2);
}



