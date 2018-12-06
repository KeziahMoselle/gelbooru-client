require('dotenv').config()

// Modules
const { shell, remote } = require('electron')
const axios = require('axios')
const store = require('./store')
const saveFile = remote.require('electron-save-file')

// Values
let tags
let rating = 'rating:safe'
let imgLimit = 10
let view = 'one_column'
let pid = 1
let tagsBlacklist = ''

// Components
require('./components/window')
require('./components/navbar')
require('./components/theme')
require('./components/searchbar')
require('./components/sidenav')
require('./components/blacklist')
require('./components/endlessScrolling')

// Handle links
document.addEventListener('click', (event) => {
  event.stopPropagation()
  if (event.target.tagName === 'A') {
    if (event.target.href.startsWith('https://gelbooru.com/') || event.target.href.startsWith('https://github.com/')) {
      event.preventDefault()
      shell.openExternal(event.target.href)
    } else if (event.target.id === 'sidenavImageSaveAs') {
      event.preventDefault()
      saveFile(event.target.href)
        .then(() => {
          M.toast({ html: 'Picture saved !' })
        }).catch(error => M.toast({ html: error.stack }))
    }
  } else if (event.target.localName === 'img' && event.target.className !== 'no-content-img') {
    openImageDetails(event)
  }
})

// Online / Offline detection
if (!navigator.onLine) {
  document.querySelector('.no-content-img').setAttribute('src', 'assets/images/undraw_offline.svg')
  M.toast({ html: 'You are offline. Please check your connection and retry' })
}

// Livereload only on development environment
if (process.env.NODE_ENV === 'development') {
  require('electron-connect').client.create()
}
