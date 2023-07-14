const toggleForm = document.getElementById('toggleForm');
const form = document.querySelector('form');

let buttonStates = {
  "ADD NOTE" : "CLOSE FORM",
  "CLOSE FORM" : "ADD NOTE"
}
let show = false;

function handleToggleForm(){

  form.classList.toggle("toggleForm");
  
  show = !show;
  toggleForm.innerText = buttonStates[toggleForm.innerText];

  document.querySelector("input").focus()
}

function encodeHTML(s){
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}


function createElementWithClass(tagName, classes) {
  const el = document.createElement(tagName);
  el.setAttribute('class', classes);

  return el;
}


// Create Note Item 
function createItem(title, content, id) {
  const elGroup = createElementWithClass('div', 'group note-item');

  const elTitle = createElementWithClass('p', 'title');
  const elContent = createElementWithClass('p', 'content');

  const elEditBtn = createElementWithClass('button', 'btn note-edit');
  const elDeleteBtn = createElementWithClass('button', 'btn note-delete');

  elTitle.textContent = encodeHTML(title);
  elContent.textContent = encodeHTML(content);
  
  elEditBtn.textContent = "EDIT";
  elEditBtn.addEventListener('click', () => {
    
    const elModal = document.querySelector(`#modal-${id}`);

    if (elModal.style.display === 'block') {
      elModal.style.display = 'none';
      elEditBtn.textContent = "EDIT"
    } else {
      elModal.style.display = 'block';
      elEditBtn.textContent = "ABORT"
    }
  });
  
  elDeleteBtn.textContent = "DELETE";
  elDeleteBtn.setAttribute('id', id);
  elDeleteBtn.addEventListener('click', () => {
    const deleteNote = confirm("Are you sure you want to DELETE this note?");
    if (deleteNote) {
      localStorage.removeItem(id);
      location.reload();
    }
  });


// Create Edit Modal
function createModal(content, onSave, id) {
  const elModal = createElementWithClass('div', 'modal');
  const elModalContent = createElementWithClass('div', 'modal-content');
  const elModalClose = createElementWithClass('span', 'modal-close');
  const elModalTitle = createElementWithClass('input', 'modal-title');
  const elModalTextarea = createElementWithClass('textarea', 'modal-textarea');
  const elModalSubmit = createElementWithClass('button', 'btn btn-green modal-submit');

  elModalTitle.value = title; // Set initial value for the title input
  elModalTextarea.value = content; // Set initial value for the content textarea
  elModalSubmit.textContent = 'UPDATE';

  elModalClose.addEventListener('click', () => {
    elModal.style.display = 'none';
  });

  // Update note with new edited title or content
  elModalSubmit.addEventListener('click', () => {
    const updatedTitle = elModalTitle.value; // Get the updated title from the input
    const updatedContent = elModalTextarea.value; // Get the updated content from the textarea
    elEditBtn.textContent = "EDIT"
    onSave(updatedContent);
    
    // Update the title textContent
    elTitle.textContent = encodeHTML(updatedTitle);

    localStorage.setItem(id, JSON.stringify({ title: updatedTitle, content: encodeHTML(updatedContent) }));
    elModal.style.display = 'none';
  });

  elModalContent.append(elModalClose, elModalTitle, elModalTextarea, elModalSubmit);
  elModal.append(elModalContent);

  // Note highlight group by title
   elGroup.addEventListener('click', (event) => {

  if (!event.target.closest('.note-edit') && !event.target.closest('.note-delete') && !event.target.closest('.modal-content')) {
    const allNoteElements = document.querySelectorAll('.note-item');
    allNoteElements.forEach((element) => {
      const titleElement = element.querySelector('.title');

      // Title is exact match or first word in title is same day of the week
      const titleWords = titleElement.textContent.split(' ');
      const elTitleWords = elTitle.textContent.split(' ');

      const firstWord = titleWords[0].toLowerCase();
      const elFirstWord = elTitleWords[0].toLowerCase();

      const daysOfWeek = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ];

      let isMatch = false;

      // Check if the first word of titleElement is a day of the week and matches the first word of elTitle
      if (daysOfWeek.includes(firstWord) && firstWord === elFirstWord) {
        isMatch = true;
      }

      if (isMatch || titleElement.textContent.toLowerCase() === elTitle.textContent.toLowerCase()) {
        element.style.backgroundColor = '#fefd00';
      } else {
        element.style.backgroundColor = '#fffae6';
      }

    });
  }
});


  return elModal;
}


const elModal = createModal(content, (updatedContent) => {
  elContent.textContent = encodeHTML(updatedContent);
  localStorage.setItem(id, JSON.stringify({ title, content: updatedContent }));
  elModal.style.display = 'none';
}, id);

elModal.setAttribute('id', `modal-${id}`);

elGroup.append(elTitle, elContent, elEditBtn, elDeleteBtn, elModal);

return elGroup;
}


// Reset note highlight by clicking anywhere outside of any notes
document.addEventListener('click', (event) => {
  if (!event.target.closest('.note-item')) {
    const allNoteElements = document.querySelectorAll('.note-item');
    allNoteElements.forEach((element) => {
      element.style.backgroundColor = '';
    });
  }
});


const root = document.getElementById('root');

// form input elements
const title = document.getElementById('title');
const content = document.getElementById('content');

const add = document.getElementById('add');

add.onclick = () => {

  const obj = {
    title: title.value,
    content: content.value
  }

  let d = new Date();
  let timestamp = d.getTime();
  // let id = Math.random(0,1);

  if(obj.title) {
    localStorage.setItem(JSON.stringify(timestamp), JSON.stringify(obj));
    location.reload();
  }

  // reset form input fields
  title.value = "";
  content.value = "";
}

// console.log(localStorage);

// Retrieve all keys from localStorage
const keys = Object.keys(localStorage);

// Sort the keys based on the titles (alphabetically)
keys.sort((a, b) => {
  const noteA = JSON.parse(localStorage.getItem(a));
  const noteB = JSON.parse(localStorage.getItem(b));
  const titleA = noteA.title.toLowerCase();
  const titleB = noteB.title.toLowerCase();

  if (titleA < titleB) {
    return -1; // titleA comes before titleB
  }
  if (titleA > titleB) {
    return 1; // titleA comes after titleB
  }
  return 0; // titles are equal
});


// Iterate over sorted keys and render the data
for (let i = 0; i < keys.length; i++) {
  const id = keys[i];

  // Retrieve note data
  const note = JSON.parse(localStorage.getItem(id));
  const title = note.title;
  const content = note.content;

  // Append the sorted note data to the DOM
  root.appendChild(createItem(title, content, id));
}






function deleteAll(){
  const deleteAllNotes = confirm("Are you sure you want to DELETE ALL NOTES?");
  if(deleteAllNotes){
    localStorage.clear(); 
    location.reload();
  }
}

let size;
function changeFontSize(delta) {
  var tags = document.querySelectorAll('p');
  for (i = 0; i < tags.length; i++) {
    size = tags[i].style.fontSize
    increaseFontSizeBtn.disabled = false;
    decreaseFontSizeBtn.disabled = false;
    if (size) {
      size = parseInt(tags[i].style.fontSize.replace("px", ""));
    } else {
      size = 48; // onload size
    } if (size > 53) {
      increaseFontSizeBtn.disabled = true;
      size = 52;
    } else if(size < 7){
      decreaseFontSizeBtn.disabled = true;
      size = 8;
    } else{
      size += delta;
    }
    tags[i].style.fontSize = size + "px"
  }
    // console.log(size)
}

function increaseFontSize() {
  changeFontSize(4);
}

function decreaseFontSize() {
  changeFontSize(-4);
}

const increaseFontSizeBtn = document.getElementById('increase-font-size')
increaseFontSizeBtn.onclick = increaseFontSize;

const decreaseFontSizeBtn = document.getElementById('decrease-font-size')
decreaseFontSizeBtn.onclick = decreaseFontSize;