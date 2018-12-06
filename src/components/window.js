const { remote } = require('electron')

// Minimize
document.getElementById('win-minimize').addEventListener('click', minimize)

// Fullscreen
document.getElementById('win-fullscreen').addEventListener('click', fullscreen)

// Close
document.getElementById('win-close').addEventListener('click', close)

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

