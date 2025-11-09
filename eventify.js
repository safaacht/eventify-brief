
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


// addint new object 
  const newEvent={
    id: events.length + 1,
    title,
    image,
    description,
    seats,
    price,
    variants: []   
};
  
  events.push(newEvent);
  console.log("✅ Event created:", newEvent);



// reseting the form
  e.target.reset();
}

document.getElementById('event-form').addEventListener('submit', handleFormSubmit)



