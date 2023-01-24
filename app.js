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
  const elGroup = createElementWithClass('div', 'group');

  const elTitle = createElementWithClass('p', 'title');
  const elContent = createElementWithClass('p', 'content');
  const elDeleteBtn = createElementWithClass('button', 'btn note-delete');

  elTitle.textContent = encodeHTML(title);
  elContent.textContent = encodeHTML(content);

  elDeleteBtn.textContent = "DELETE";
  elDeleteBtn.setAttribute('id', id);
  elDeleteBtn.onclick = () => {
    const deleteNote = confirm("Are you sure you want to DELETE this note?");
    if(deleteNote){
      localStorage.removeItem(id)
      location.reload();
    }
  }


  elGroup.append(elTitle, elContent, elDeleteBtn);
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

  if(obj){
    localStorage.setItem(JSON.stringify(timestamp), JSON.stringify(obj));
    location.reload();
  }

  // reset form input fields
  title.value = "";
  content.value = "";
}

for(let i = 0; i < localStorage.length; i++){
  
  const id = localStorage.key(i);
  
  const note = JSON.parse(localStorage.getItem(id));
  const title = note.title;
  const content = note.content;
  
  root.appendChild(createItem(title, content, id))

}


function deleteAll(){
  const deleteAllNotes = confirm("Are you sure you want to DELETE ALL NOTES?");
  if(deleteAllNotes){
    localStorage.clear(); 
    location.reload();
  }
}
