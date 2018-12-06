const { remote } = require('electron')

// Minimize
document.getElementById('win-minimize').addEventListener('click', (event) => {
  event.preventDefault()
  let window = remote.getCurrentWindow()
  window.minimize()
})

// Fullscreen
document.getElementById('win-fullscreen').addEventListener('click', (event) => {
  event.preventDefault()
  let window = remote.getCurrentWindow()
  if (!window.isMaximized()) {
    window.maximize()
  } else {
    window.unmaximize()
  }
})

// Close
document.getElementById('win-close').addEventListener('click', (event) => {
  event.preventDefault()
  let window = remote.getCurrentWindow()
  window.close()
})