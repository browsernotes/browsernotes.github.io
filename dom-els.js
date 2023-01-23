function createElementWithClass(tagName, classes) {
  const el = document.createElement(tagName)
  el.setAttribute('class', classes)

  return el
}
function createItem(artist, title, year) {
  const elGroup = createElementWithClass('div', 'group')

  const elArtist = createElementWithClass('p', 'artist')
  const elTitle = createElementWithClass('p', 'title')
  const elYear = createElementWithClass('p', 'year')

  elArtist.textContent = artist
  elTitle.textContent = title
  elYear.textContent = year

  elGroup.append(elArtist, elTitle, elYear)
  return elGroup
}

const list = document.getElementById('list')

getData()
async function getData() {
  data = await (await fetch('https://musicapi.olk1.com/data.json', { mode: 'cors' })).json()

  for ({ artist, title, year } of data.music.eps) {
    list.appendChild(createItem(artist, title, year))
  }

  for ({ artist, title, year } of data.music.lps) {
    list.appendChild(createItem(artist, title, year))
  }
  console.log(data.status)
}