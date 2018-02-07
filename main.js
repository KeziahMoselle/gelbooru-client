// Modules

  const electron = require('electron');
  const app = electron.app;
  const BrowserWindow = electron.BrowserWindow;
  const path = require('path');
  const url = require('url');

let window;

// Events

  app.on('ready', createWindow);

  app.on('window-all-closed', function(){
    if(process.platform !== 'darwin')
    {
      app.quit();
    }
  })

  app.on('activate', function(){
    if(window === null)
    {
      createWindow();
    }
  });

// Functions

  // Créer la fenêtre
  function createWindow()
  {
    window = new BrowserWindow({width: 1200, height: 800, frame: false});
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
    window.show();
  }