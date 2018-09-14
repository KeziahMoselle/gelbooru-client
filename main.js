// Modules

  const electron = require('electron'),
        app = electron.app,
        BrowserWindow = electron.BrowserWindow,
        path = require('path'),
        url = require('url'),
        Store = require('electron-store');

  let window;

// Store

  const store = new Store({
    defaults: {
      windowBounds: {
        width: 1400,
        height: 800
      }
    }
  });

// Events

  app.on('ready', () => {
    let {width, height} = store.get('windowBounds');
    window = new BrowserWindow({
      width: width,
      height: height,
      frame: false,
      backgroundColor: '#242424',
      icon: path.join(__dirname, 'build/icon.ico'),
      title: 'Gelbooru Client'
    });
    window.loadURL(url.format({
      pathname: path.join(__dirname, './src/index.html'),
      protocol: 'file:',
      slashes: true
    }));
    window.show();

    window.on('resize', () => {
      let {width, height} = window.getBounds();
      store.set('windowBounds', {width, height});
    });
  });

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