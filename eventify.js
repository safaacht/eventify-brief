
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

  if (!title) return alert("Title is required");
  if (!description) return alert("Description is required");
  if (seats < 1) return alert("Seats must be at least 1");




  e.target.reset();
}

document.getElementById('event-form').addEventListener('submit', handleFormSubmit)



