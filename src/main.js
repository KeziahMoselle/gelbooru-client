// Modules

const electron = require('electron')

const app = electron.app

const BrowserWindow = electron.BrowserWindow

const path = require('path')

const url = require('url')

const store = require('./store')

let window

// Events

app.on('ready', () => {
  let { width, height } = store.get('windowBounds')
  window = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    backgroundColor: '#242424',
    icon: path.join(__dirname, '../build/icon.ico'),
    title: 'Gelbooru Client'
  })
  window.loadURL(url.format({
    pathname: path.join(__dirname, './index.html'),
    protocol: 'file:',
    slashes: true
  }))
  window.show()

  window.on('resize', () => {
    let { width, height } = window.getBounds()
    store.set('windowBounds', { width, height })
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
