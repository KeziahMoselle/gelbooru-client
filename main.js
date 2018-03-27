// Modules

  const electron = require('electron'),
        app = electron.app,
        BrowserWindow = electron.BrowserWindow,
        path = require('path'),
        url = require('url'),
        Store = require('electron-store'),
        store = new Store();

  let window;

// Store

width = store.get('width');
height = store.get('height');

// Events

  app.on('ready', () => {
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
      store.set('height', height);
      store.set('width', width);
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