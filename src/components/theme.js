const store = require('electron-store')
const {
  root,
  checkboxTheme,
  documentElement
} = require('../helpers/elements')

// AT LAUNCH : Update CSS var
if (store.get('theme') === 'light-mode') {
  root.classList.add('light-mode')
  checkboxTheme.setAttribute('checked', 'checked')
}
documentElement.style.setProperty('--primary', store.get('themeCustomization.primary'))
documentElement.style.setProperty('--accent', store.get('themeCustomization.accent'))
documentElement.style.setProperty('--dark', store.get('themeCustomization.dark'))

// Add / Remove light theme
checkboxTheme.addEventListener('change', handleCheckboxTheme)

document.getElementById('openThemeCustomizationModalBtn').addEventListener('click', (event) => {
  event.preventDefault()
  // Get themes colors from the store
  let primaryColor = store.get('themeCustomization.primary')
  let accentColor = store.get('themeCustomization.accent')
  let darkColor = store.get('themeCustomization.dark')
  // Set the color of the three div.preview-color
  document.getElementById('primaryColor-preview').style.backgroundColor = primaryColor
  document.getElementById('accentColor-preview').style.backgroundColor = accentColor
  document.getElementById('darkColor-preview').style.backgroundColor = darkColor
  // Open Modal
  const themeCustomization = document.querySelector('#themeCustomization.modal')
  const instancethemeCustomization = M.Modal.init(themeCustomization)
  instancethemeCustomization.open()
})

// Update :root CSS variables
document.getElementById('updateThemeBtn').addEventListener('click', (event) => {
  event.preventDefault()
  let primaryColor = document.getElementById('primaryColor').value || store.get(themeCustomization.primary)
  let accentColor = document.getElementById('accentColor').value || store.get(themeCustomization.accent)
  let darkColor = document.getElementById('darkColor').value || store.get(themeCustomization.dark)
  // Update CSS var
  documentElement.style.setProperty('--primary', primaryColor)
  documentElement.style.setProperty('--accent', accentColor)
  documentElement.style.setProperty('--dark', darkColor)
  // Persist data to the store
  store.set('themeCustomization.primary', primaryColor)
  store.set('themeCustomization.accent', accentColor)
  store.set('themeCustomization.dark', darkColor)
  // Feedback
  M.toast({ html: 'The color palette has been updated !' })
})

document.getElementById('resetThemeBtn').addEventListener('click', (event) => {
  event.preventDefault()
  // Update CSS var
  documentElement.style.setProperty('--primary', '#35385B')
  documentElement.style.setProperty('--accent', '#6688EC')
  documentElement.style.setProperty('--dark', '#242424')

  document.getElementById('primaryColor').setAttribute('placeholder', primaryColor)
  document.getElementById('accentColor').setAttribute('placeholder', accentColor)
  document.getElementById('darkColor').setAttribute('placeholder', darkColor)

  document.getElementById('handleColorPickerPrimary').setAttribute('value', '#35385B')
  document.getElementById('handleColorPickerAccent').setAttribute('value', '#6688EC')
  document.getElementById('handleColorPickerDark').setAttribute('value', '#242424')
  // Persist data to the store
  store.set('themeCustomization.primary', '#35385B')
  store.set('themeCustomization.accent', '#6688EC')
  store.set('themeCustomization.dark', '#242424')
  // Feedback
  M.toast({ html: 'The color palette has been restored !' })
})

// COLOR PICKER
document.getElementById('handleColorPickerPrimary').addEventListener('change', () => {
  let primaryColor = document.getElementById('handleColorPickerPrimary').value || store.get(themeCustomization.primary)
  documentElement.style.setProperty('--primary', primaryColor)
  document.getElementById('primaryColor-preview').style.backgroundColor = primaryColor
  document.getElementById('primaryColor').setAttribute('placeholder', primaryColor)
  store.set('themeCustomization.primary', primaryColor)
  M.toast({ html: 'The primary color has been updated !' })
})

document.getElementById('handleColorPickerAccent').addEventListener('change', () => {
  let accentColor = document.getElementById('handleColorPickerAccent').value || store.get(themeCustomization.accent)
  documentElement.style.setProperty('--accent', accentColor)
  document.getElementById('accentColor-preview').style.backgroundColor = accentColor
  document.getElementById('accentColor').setAttribute('placeholder', accentColor)
  store.set('themeCustomization.accent', accentColor)
  M.toast({ html: 'The accent color has been updated !' })
})

document.getElementById('handleColorPickerDark').addEventListener('change', () => {
  let darkColor = document.getElementById('handleColorPickerDark').value || store.get(themeCustomization.dark)
  documentElement.style.setProperty('--dark', darkColor)
  document.getElementById('darkColor-preview').style.backgroundColor = darkColor
  document.getElementById('darkColor').setAttribute('placeholder', darkColor)
  store.set('themeCustomization.dark', darkColor)
  M.toast({ html: 'The dark color has been updated !' })
})

// TEXT INPUT COLOR
document.getElementById('primaryColor').addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    let primaryColor = document.getElementById('primaryColor').value || store.get(themeCustomization.primary)
    documentElement.style.setProperty('--primary', primaryColor)
    document.getElementById('primaryColor-preview').style.backgroundColor = primaryColor
    event.currentTarget.value = ''
    document.getElementById('primaryColor').setAttribute('placeholder', primaryColor)
    store.set('themeCustomization.primary', primaryColor)
    M.toast({ html: 'The primary color has been updated !' })
  }
})

document.getElementById('accentColor').addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    let accentColor = document.getElementById('accentColor').value || store.get(themeCustomization.accent)
    documentElement.style.setProperty('--accent', accentColor)
    document.getElementById('accentColor-preview').style.backgroundColor = accentColor
    event.currentTarget.value = ''
    document.getElementById('accentColor').setAttribute('placeholder', accentColor)
    store.set('themeCustomization.accent', accentColor)
    M.toast({ html: 'The accent color has been updated !' })
  }
})

document.getElementById('darkColor').addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    let darkColor = document.getElementById('darkColor').value || store.get(themeCustomization.dark)
    documentElement.style.setProperty('--dark', darkColor)
    document.getElementById('darkColor-preview').style.backgroundColor = darkColor
    event.currentTarget.value = ''
    document.getElementById('darkColor').setAttribute('placeholder', darkColor)
    store.set('themeCustomization.dark', darkColor)
    M.toast({ html: 'The dark color has been updated !' })
  }
})

function handleCheckboxTheme (event) {
  event.preventDefault()
  if (store.get('theme') === 'light-mode') { // Actual theme = Light Mode -> Switch on Dark Mode
    root.classList.remove('light-mode')
    M.toast({ html: 'Dark theme activated' })
    store.set('theme', 'dark-mode')
  } else { // Actual theme = Dark Mode -> Switch on Light Mode
    root.classList.add('light-mode')
    M.toast({ html: 'Light theme activated' })
    store.set('theme', 'light-mode')
  }
}
