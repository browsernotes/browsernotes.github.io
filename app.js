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


function createItem(title, content, id) {
  const elGroup = createElementWithClass('div', 'group note-item');
  
  const elTitle = createElementWithClass('p', 'title');
  const elContent = createElementWithClass('p', 'content');
  const elDeleteBtn = createElementWithClass('button', 'btn note-delete');

  elTitle.textContent = encodeHTML(title);
  elContent.textContent = encodeHTML(content);

  elDeleteBtn.textContent = "DELETE";
  elDeleteBtn.setAttribute('id', id);
  elDeleteBtn.addEventListener('click', () => {
    const deleteNote = confirm("Are you sure you want to DELETE this note?");
    if (deleteNote) {
      localStorage.removeItem(id);
      location.reload();
    }
  });

  let isToggled = false;

  elGroup.append(elTitle, elContent, elDeleteBtn);
  
   elGroup.addEventListener('click', () => {
    const allNoteElements = document.querySelectorAll('.note-item');
    allNoteElements.forEach((element) => {
      const titleElement = element.querySelector('.title');

      if (titleElement.textContent !== elTitle.textContent) {
        if(isToggled) {
          element.style.backgroundColor = 'lightgray';
        } else {
          element.style.backgroundColor = '';
        }
      }
    });
    isToggled = !isToggled;
  });

  return elGroup;
}


const root = document.getElementById('root');

// input els
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