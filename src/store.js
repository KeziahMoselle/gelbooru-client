const Store = require('electron-store')

module.exports = new Store({
  defaults: {
    themeCustomization: {
      'primary': '#35385B',
      'accent': '#6688EC',
      'dark': '#242424'
    },
    theme: 'dark-theme',
    windowBounds: {
      width: 1400,
      height: 800
    }
  }
})
