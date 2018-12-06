const { remote } = require('electron')
const {
  winMinimize,
  winFullscreen,
  winClose
} = require('../helpers/elements.js')
console.log(winMinimize)

winMinimize.addEventListener('click', minimize)
winFullscreen.addEventListener('click', fullscreen)
winClose.addEventListener('click', close)

function minimize (event) {
  event.preventDefault()
  let window = remote.getCurrentWindow()
  window.minimize()
}

function fullscreen (event) {
  event.preventDefault()
  let window = remote.getCurrentWindow()
  if (!window.isMaximized()) {
    window.maximize()
  } else {
    window.unmaximize()
  }
}

function close (event) {
  event.preventDefault()
  let window = remote.getCurrentWindow()
  window.close()
}
