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
    } else {
      elModal.style.display = 'block';
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
  const elModalTitle = createElementWithClass('h2', 'modal-title');
  const elModalTextarea = createElementWithClass('textarea', 'modal-textarea');
  const elModalSubmit = createElementWithClass('button', 'btn btn-green modal-submit');

  elModalTextarea.value = content;
  elModalSubmit.textContent = 'Submit';

  elModalClose.addEventListener('click', () => {
    elModal.style.display = 'none';
  });

  // Update note with new edited content
  elModalSubmit.addEventListener('click', () => {
  const updatedContent = elModalTextarea.value;
  
  onSave(updatedContent);
  localStorage.setItem(id, JSON.stringify({title, content: encodeHTML(updatedContent) }));
  elModal.style.display = 'none';
});


  elModalContent.append(elModalClose, elModalTitle, elModalTextarea, elModalSubmit);
  elModal.append(elModalContent);


   elGroup.addEventListener('click', (event) => {
  // Check if the clicked element or its ancestors have the .modal-textarea class
  if (!event.target.closest('.note-edit') && !event.target.closest('.modal-content')) {
    const allNoteElements = document.querySelectorAll('.note-item');
    allNoteElements.forEach((element) => {
      const titleElement = element.querySelector('.title');

      if (titleElement.textContent !== elTitle.textContent) {
        element.style.backgroundColor = '#cccccc';
      } else {
        element.style.backgroundColor = '';
      }
    });
  }
});


  return elModal;
}


const elModal = createModal(content, (updatedContent) => {
  elContent.textContent = encodeHTML(updatedContent);
  // const noteData = JSON.parse(localStorage.getItem(id));
  // noteData.content = updatedContent;
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

// Sort the keys based on the titles
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