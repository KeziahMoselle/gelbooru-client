const windowElement = window.window
const documentElement = document.documentElement
const root = document.getElementById('root')

const winMinimize = document.getElementById('win-minimize')
const winFullscreen = document.getElementById('win-fullscreen')
const winClose = document.getElementById('win-close')

const searchBar = document.getElementById('searchBar')
const loading = document.getElementById('loading')
const container = document.getElementById('container')

const displayRating = document.getElementById('displayRating')
const displayLimit = document.getElementById('displayLimit')
const displayLayout = document.getElementById('displayLayout')
const displayPid = document.getElementById('displayPid')

const sidenavImageSource = document.getElementById('sidenavImageSource')
const sidenavImageSaveAs = document.getElementById('sidenavImageSaveAs')
const sidenavImageDirectory = document.getElementById('sidenavImageDirectory')
const sidenavImageOwner = document.getElementById('sidenavImageOwner')
const sidenavImageScore = document.getElementById('sidenavImageScore')


const chips = document.querySelector('.chips')

const checkboxTheme = document.getElementById('checkboxTheme')

const elements = {
  windowElement,
  documentElement,
  root,
  searchBar,
  loading,
  container,
  displayRating,
  displayLimit,
  displayLayout,
  displayPid,
  sidenavImageSource,
  sidenavImageSaveAs,
  sidenavImageDirectory,
  sidenavImageOwner,
  sidenavImageScore,
  chips,
  checkboxTheme
}

console.log(elements)

module.exports = elements
