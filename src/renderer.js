/* global M, themeCustomization */

require('dotenv').config()

// Modules
const { shell, remote } = require('electron')
const axios = require('axios')
const store = require('./store')
const saveFile = remote.require('electron-save-file')

// HTML elements
const windowElement = window.window
const documentElement = document.documentElement
const root = document.getElementById('root')
// Body
const searchBar = document.getElementById('searchBar')
// Input type text
const loading = document.getElementById('loading')
// Display loading or not
const container = document.getElementById('container')
// Container of images

const displayRating = document.getElementById('displayRating')
// Display Rating
const displayLimit = document.getElementById('displayLimit')
// Display Image limit chip
const displayLayout = document.getElementById('displayLayout')
// Display Card Layout
const displayPid = document.getElementById('displayPid')
// Display chip

const sidenavImageSource = document.getElementById('sidenavImageSource')
const sidenavImageSaveAs = document.getElementById('sidenavImageSaveAs')
const sidenavImageDirectory = document.getElementById('sidenavImageDirectory')
const sidenavImageOwner = document.getElementById('sidenavImageOwner')
const sidenavImageScore = document.getElementById('sidenavImageScore')

const chips = document.querySelector('.chips')

const checkboxTheme = document.getElementById('checkboxTheme')

// Values
let tags
let rating = 'rating:safe'
let imgLimit = 10
let view = 'one_column'
let pid = 1
let tagsBlacklist = ''

// Minimize
document.getElementById('win-minimize').addEventListener('click', (event) => {
  let window = remote.getCurrentWindow()
  window.minimize()
})

// Fullscreen
document.getElementById('win-fullscreen').addEventListener('click', (event) => {
  let window = remote.getCurrentWindow()
  if (!window.isMaximized()) {
    window.maximize()
  } else {
    window.unmaximize()
  }
})

// Close
document.getElementById('win-close').addEventListener('click', (event) => {
  let window = remote.getCurrentWindow()
  window.close()
})

// INPUT AND HIT ENTER
searchBar.onkeydown = (event) => {
  if (event.keyCode === 13) {
    emptyContainer()
    tags = searchBar.value
    console.log(`Searching images for ${tags} and ${rating}`)
    let url = getUrl(tags, imgLimit, rating)
    getResults(url)
  } else {
    tags = searchBar.value
    axios.get(`https://gelbooru.com/index.php?page=dapi&s=tag&q=index&json=1&name_pattern=${tags.replace(/\s/g, '+')}&limit=3&order=DESC&orderby=count`)
      .then((response) => {
        let popularTags = response.data
        let list = document.getElementsByClassName('tagResult')
        for (let i = 0; i < list.length; i++) {
          list[i].innerHTML = `${popularTags[i].tag} (${popularTags[i].count})`
        }
      })
  }
}

// Refresh
function Refresh () {
  emptyContainer()
  tags = searchBar.value
  console.log(`Actualize with: ${tags} and ${rating}`)
  let url = getUrl(tags, imgLimit, rating)
  getResults(url)
}

// Refresh Btn
document.getElementById('refreshBtn').addEventListener('click', () => {
  Refresh()
})

// All images
document.getElementById('searchAllBtn').addEventListener('click', () => {
  Refresh()
})

// Top images
document.getElementById('searchTopBtn').addEventListener('click', () => {
  tags = 'sort:score'
  emptyContainer()
  let url = getUrl(tags, imgLimit, rating)
  getResults(url)
})

// Hot images
document.getElementById('searchHotBtn').addEventListener('click', () => {
  tags = 'sort:date score:>=5'
  emptyContainer()
  let url = getUrl(tags, imgLimit, rating)
  getResults(url)
})

// Open Blacklist modal
document.getElementById('openBlacklistModalBtn').addEventListener('click', () => {
  const blacklistModal = document.querySelector('#blacklist.modal')
  const instanceBlacklistModal = M.Modal.init(blacklistModal)
  instanceBlacklistModal.open()
})

document.getElementById('openThemeCustomizationModalBtn').addEventListener('click', () => {
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

// Update 'tagsBlacklist' let
document.getElementById('updateBlacklistBtn').addEventListener('click', () => {
  tagsBlacklist = ''
  let ChipsData = M.Chips.getInstance(chips).chipsData
  if (ChipsData.length > 1) {
    let i = 1
    ChipsData.forEach(data => {
      if (ChipsData.length === i) {
        console.log(data.tag)
        tagsBlacklist += `-${data.tag}`
      } else {
        console.log(data.tag)
        tagsBlacklist += `-${data.tag}+`
      }
      i++
    })
  } else if (ChipsData.length === 1) {
    tagsBlacklist += `-${ChipsData[0].tag}`
  }

  M.toast({ html: 'Blacklist updated !' })
})

// Update :root CSS variables
document.getElementById('updateThemeBtn').addEventListener('click', () => {
  let primaryColor = document.getElementById('primaryColor').value || store.get(themeCustomization.primary)
  let accentColor = document.getElementById('accentColor').value || store.get(themeCustomization.accent)
  let darkColor = document.getElementById('darkColor').value || store.get(themeCustomization.dark)
  // Update CSS var
  document.documentElement.style.setProperty('--primary', primaryColor)
  document.documentElement.style.setProperty('--accent', accentColor)
  document.documentElement.style.setProperty('--dark', darkColor)
  // Persist data to the store
  store.set('themeCustomization.primary', primaryColor)
  store.set('themeCustomization.accent', accentColor)
  store.set('themeCustomization.dark', darkColor)
  // Feedback
  M.toast({ html: 'The color palette has been updated !' })
})

document.getElementById('resetThemeBtn').addEventListener('click', () => {
  // Update CSS var
  document.documentElement.style.setProperty('--primary', '#35385B')
  document.documentElement.style.setProperty('--accent', '#6688EC')
  document.documentElement.style.setProperty('--dark', '#242424')

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

// Update at launch the theme
// Get themes colors from the store
let primaryColor = store.get('themeCustomization.primary')
let accentColor = store.get('themeCustomization.accent')
let darkColor = store.get('themeCustomization.dark')
// Update CSS var
document.documentElement.style.setProperty('--primary', primaryColor)
document.documentElement.style.setProperty('--accent', accentColor)
document.documentElement.style.setProperty('--dark', darkColor)

// Sidenav image details
function openImageDetails (event) {
  // Fetch image informations with ID
  let imageId = event.target.id
  axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&id=${imageId}&json=1`)
    .then((response) => {
      // Setting up values
      let image = response.data[0]
      let tags = image.tags.split(' ')
      // Update values
      sidenavImageSource.setAttribute('href', `https://gelbooru.com/index.php?page=post&s=view&id=${image.id}`)
      sidenavImageSaveAs.setAttribute('href', `${image.file_url}`)
      sidenavImageDirectory.innerHTML = `<i class="material-icons">folder</i> Directory: ${image.directory}`
      sidenavImageOwner.innerHTML = `<i class="material-icons">account_circle</i> Owner: ${image.owner}`
      sidenavImageScore.innerHTML = `<i class="material-icons">show_chart</i> Score: ${image.score}`
      // Clear tags container
      while (document.getElementById('TagsParent').firstChild) {
        document.getElementById('TagsParent').removeChild(document.getElementById('TagsParent').firstChild)
      }
      // Insert new tags
      tags.forEach(tag => {
        document.getElementById('TagsParent').insertAdjacentHTML('beforeend', `
            <li><a class="waves-effect ${isTagInSearchBar(tag) ? 'sidenav-tags-in-searchbar' : 'sidenav-tags-not-in-searchbar'}" id="ADDCLASSTO_${tag}">${tag}</a></li>
          `)
      })
    })
  // Open sidenav
  const sidenavImageDetails = document.querySelector('#sidenavImageDetails.sidenav')
  const instanceSidenavImageDetails = M.Sidenav.init(sidenavImageDetails)
  instanceSidenavImageDetails.open()
}

// GET rating
document.getElementById('ratingBtn').addEventListener('click', () => {
  switch (rating) {
    case 'rating:safe': // Switch on Questionable
      displayRating.innerHTML = 'warning'
      rating = 'rating:questionable'
      M.toast({ html: `Rating is now ${rating}` })
      break

    case 'rating:questionable': // Switch on Explicit
      displayRating.innerHTML = 'lock_open'
      rating = 'rating:explicit'
      M.toast({ html: `Rating is now ${rating}` })
      break

    case 'rating:explicit': // Switch on All
      displayRating.innerHTML = 'all_inclusive'
      rating = ''
      M.toast({ html: `Rating is now everything` })
      break

    case '': // Switch on Safe
      displayRating.innerHTML = 'lock_outline'
      rating = 'rating:safe'
      M.toast({ html: `Rating is now ${rating}` })
      break
  }
})

// Change layout view
document.getElementById('layoutBtn').addEventListener('click', () => {
  let cardsNodeList = document.getElementsByClassName('card-view')
  let cards = Array.from(cardsNodeList)
  let videosNodeList = document.getElementsByClassName('responsive-video')
  let videos = Array.from(videosNodeList)
  switch (view) {
    case 'one_column': // If one_column switch on two_column
      displayLayout.innerHTML = 'view_agenda'
      view = 'two_column'
      container.classList.remove('card-container')
      if (cards.length >= 1) {
        cards.forEach(card => {
          container.classList.remove('card-column-3')
          container.classList.add('card-column-2')
        })
      } else if (videos.length >= 1) {
        console.log(videos)
        videos.forEach(video => {
          container.classList.remove('card-column-3')
          container.classList.add('card-column-2')
        })
      } else {
        console.log('No cards')
      }
      break

    case 'two_column': // if two_column switch on three_column
      displayLayout.innerHTML = 'view_carousel'
      view = 'three_column'
      container.classList.remove('card-container')
      if (cards.length >= 1) {
        cards.forEach(card => {
          container.classList.remove('card-column-2')
          container.classList.add('card-column-1')
        })
      } else if (videos.length >= 1) {
        videos.forEach(video => {
          container.classList.remove('card-column-2')
          container.classList.add('card-column-1')
        })
      } else {
        console.log('No cards')
      }
      break

    case 'three_column': // if three_column switch on one_column
      displayLayout.innerHTML = 'view_module'
      view = 'one_column'
      container.classList.add('card-container')
      if (cards.length >= 1) {
        cards.forEach(card => {
          container.classList.remove('card-column-1')
          container.classList.add('card-column-3')
        })
      } else if (videos.length >= 1) {
        videos.forEach(video => {
          container.classList.remove('card-column-1')
          container.classList.add('card-column-3')
        })
      } else {
        console.log('No cards')
      }
      break
  }
})

// GET imgLimit
document.getElementById('limitBtn').addEventListener('click', () => {
  switch (imgLimit) {
    case 10: // If 10 switch on 20
      displayLimit.innerHTML = '20 images'
      imgLimit = 20
      break

    case 20: // If 20 switch on 50
      displayLimit.innerHTML = '50 images'
      imgLimit = 50
      break

    case 50: // If 50 switch on 100
      displayLimit.innerHTML = '100 images'
      imgLimit = 100
      break

    case 100: // If 100 switch on 10
      displayLimit.innerHTML = '10 images'
      imgLimit = 10
      break
  }
  M.toast({ html: `Image limit is now ${imgLimit}` })
})

// Light & Dark Mode

// Enable light theme if enabled before
if (store.get('theme') === 'light-mode') {
  root.classList.add('light-mode')
  checkboxTheme.setAttribute('checked', 'checked')
  console.log('Theme : Light mode enabled.')
}

// Add / Remove light theme
document.getElementById('checkboxTheme').addEventListener('click', () => {
  if (store.get('theme') === 'light-mode') { // Actual theme = Light Mode -> Switch on Dark Mode
    root.classList.remove('light-mode')
    M.toast({ html: 'Dark theme activated' })
    store.set('theme', 'dark-mode')
  } else { // Actual theme = Dark Mode -> Switch on Light Mode
    root.classList.add('light-mode')
    M.toast({ html: 'Light theme activated' })
    store.set('theme', 'light-mode')
  }
})

// Add tag dynamically via sidenav
document.getElementById('TagsParent').addEventListener('click', (event) => {
  let tag = event.target.innerText
  if (!isTagInSearchBar(tag)) {
    searchBar.value = `${searchBar.value} ${tag}`
    document.getElementById(`ADDCLASSTO_${tag}`).classList.add('sidenav-tags-in-searchbar')
    Refresh()
    M.toast({ html: `Added ${tag}.` })
  } else {
    let tags = searchBar.value
    searchBar.value = tags.replace(tag, '')
    document.getElementById(`ADDCLASSTO_${tag}`).classList.remove('sidenav-tags-in-searchbar')
    Refresh()
    M.toast({ html: `Removed ${tag}` })
  }
})

// Handle links
document.addEventListener('click', (event) => {
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

// Pagination
document.getElementById('nextBtn').addEventListener('click', () => {
  pid++
  displayPid.innerHTML = `Page ${pid}`
  emptyContainer()
  let url = getUrl(tags, imgLimit, rating, pid)
  getResults(url)
})

document.getElementById('previousBtn').addEventListener('click', () => {
  if (pid > 1) {
    pid--
    displayPid.innerHTML = `Page ${pid}`
    emptyContainer()
    let url = getUrl(tags, imgLimit, rating, pid)
    getResults(url)
  }
})

/**
 * Show loading
 * Finished: Append cards to the container
 * Hide loading
 *
 * @param {string} url
 */
function getResults (url) {
  showLoading()

  axios.get(url)
    .then((response) => {
      if (response.data) { // We find results
        hideLoading()
        response.data.forEach(image => {
          let sampleUrl
          if (image.sample) {
            sampleUrl = `https://simg3.gelbooru.com//samples/${image.directory}/sample_${image.hash}.jpg`
          }
          if (tags.includes('webm')) {
            container.insertAdjacentHTML('beforeend', `
            <video class="responsive-video" controls loop>
              <source src="${image.file_url}" type="video/webm">
            </video>`)
          } else {
            container.insertAdjacentHTML('beforeend', `<div class="card-view">
              <div class="card">
                <div class="card-image">
                  <img id="${image.id}" src="${isSampleExist(sampleUrl) ? sampleUrl : image.file_url}">
                </div>
              </div>
            </div>`)
          }
        })
      } else { // We don't find any results
        hideLoading()
        M.toast({ html: 'Any results was found.' })
      }
    })
    .catch(() => {
      M.toast({ html: 'Search error: API disabled due to abuse.' })
    })
}

/**
 * Return a valid URL with parameters
 *
 * @param {string} [tags=''] Tags
 * @param {number} [imgLimit=10] The imgLimit by default is 10
 * @param {string} [rating='rating:safe'] Rating by default is safe
 * @param {number} [pid=1] Initial page 1
 * @returns {string} Final URL
 */
function getUrl (tags = '', imgLimit = 10, rating = 'rating:safe', pid = 1) {
  let url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=${imgLimit}&tags=${rating}`
  if (tags.length > 0) {
    url += `+${tags.replace(/\s/g, '+')}`
  }
  if (tagsBlacklist.length > 0) {
    url += `+${tagsBlacklist}`
  }
  if (!tags.includes('webm')) {
    url += `+-webm`
  }
  if (pid !== 1) {
    url += `&pid=${pid}`
  }
  console.log(`getUrl() has returned ${url}`)
  return url
}

/**
 * Remove all images in container
 */
function emptyContainer () {
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
}

/**
 * Show loading
 */
function showLoading () {
  loading.classList.remove('hide')
}

/**
 * Hide loading
 */
function hideLoading () {
  loading.classList.add('hide')
}

function isSampleExist (url) {
  if (url) {
    return true
  } else {
    return false
  }
}

function isTagInSearchBar (tag) {
  let tags = searchBar.value
  if (tags.includes(tag)) {
    return true
  } else {
    return false
  }
}

// COLOR PICKER
document.getElementById('handleColorPickerPrimary').addEventListener('change', () => {
  let primaryColor = document.getElementById('handleColorPickerPrimary').value || store.get(themeCustomization.primary)
  document.documentElement.style.setProperty('--primary', primaryColor)
  document.getElementById('primaryColor-preview').style.backgroundColor = primaryColor
  document.getElementById('primaryColor').setAttribute('placeholder', primaryColor)
  store.set('themeCustomization.primary', primaryColor)
  M.toast({ html: 'The primary color has been updated !' })
})

document.getElementById('handleColorPickerAccent').addEventListener('change', () => {
  let accentColor = document.getElementById('handleColorPickerAccent').value || store.get(themeCustomization.accent)
  document.documentElement.style.setProperty('--accent', accentColor)
  document.getElementById('accentColor-preview').style.backgroundColor = accentColor
  document.getElementById('accentColor').setAttribute('placeholder', accentColor)
  store.set('themeCustomization.accent', accentColor)
  M.toast({ html: 'The accent color has been updated !' })
})

document.getElementById('handleColorPickerDark').addEventListener('change', () => {
  let darkColor = document.getElementById('handleColorPickerDark').value || store.get(themeCustomization.dark)
  document.documentElement.style.setProperty('--dark', darkColor)
  document.getElementById('darkColor-preview').style.backgroundColor = darkColor
  document.getElementById('darkColor').setAttribute('placeholder', darkColor)
  store.set('themeCustomization.dark', darkColor)
  M.toast({ html: 'The dark color has been updated !' })
})

// TEXT INPUT COLOR
document.getElementById('primaryColor').addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    let primaryColor = document.getElementById('primaryColor').value || store.get(themeCustomization.primary)
    document.documentElement.style.setProperty('--primary', primaryColor)
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
    document.documentElement.style.setProperty('--accent', accentColor)
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
    document.documentElement.style.setProperty('--dark', darkColor)
    document.getElementById('darkColor-preview').style.backgroundColor = darkColor
    event.currentTarget.value = ''
    document.getElementById('darkColor').setAttribute('placeholder', darkColor)
    store.set('themeCustomization.dark', darkColor)
    M.toast({ html: 'The dark color has been updated !' })
  }
})

// Enable / Disable Endless Scrolling
if (store.get('endless')) {
  // Check the checkbox at launch
  document.getElementById('checkboxEndlessScrolling').setAttribute('checked', 'checked')
  // Enable Endless Scrolling
  windowElement.addEventListener('scroll', () => {
    if (windowElement.scrollY >= documentElement.scrollHeight - windowElement.innerHeight - 0.1) {
      let url = getUrl(tags, imgLimit, rating)
      pid++
      getResults(url + `&pid=${pid}`)
      displayPid.innerHTML = `Page ${pid}`
    }
  })
}

document.getElementById('checkboxEndlessScrolling').addEventListener('click', () => {
  if (store.get('endless')) {
    // If it's enabled, disable it
    store.set('endless', false)
    M.toast({ html: 'Disabled : Endless Scrolling' })
  } else {
    // If it's disabled, enable it
    store.set('endless', true)
    // Enable Endless Scrolling
    windowElement.addEventListener('scroll', () => {
      if (windowElement.scrollY >= documentElement.scrollHeight - windowElement.innerHeight - 0.1) {
        let url = getUrl(tags, imgLimit, rating)
        pid++
        getResults(url + `&pid=${pid}`)
        displayPid.innerHTML = `Page ${pid}`
      }
    })
    M.toast({ html: 'Enabled : Endless Scrolling' })
  }
})

// Livereload only on development environment
if (process.env.NODE_ENV === 'development') {
  require('electron-connect').client.create()
}
