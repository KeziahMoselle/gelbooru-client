const store = require('electron-store')

// Enable endless scrolling if `true` at launch
if (store.get('endless')) {
  // Check the checkbox at launch
  document.getElementById('checkboxEndlessScrolling').setAttribute('checked', 'checked')
  // Enable Endless Scrolling
  windowElement.addEventListener('scroll', handleEndlessScrolling)
}

document.getElementById('checkboxEndlessScrolling').addEventListener('click', () => {
  if (store.get('endless')) {
    // If it's enabled, disable it
    store.set('endless', false)
    windowElement.removeEventListener('scroll', handleEndlessScrolling)
    M.toast({ html: 'Disabled : Endless Scrolling' })
  } else {
    store.set('endless', true)
    // Enable Endless Scrolling
    windowElement.addEventListener('scroll', handleEndlessScrolling)
    M.toast({ html: 'Enabled : Endless Scrolling' })
  }
})

function handleEndlessScrolling () {
  if (windowElement.scrollY >= documentElement.scrollHeight - windowElement.innerHeight - 0.1) {
    let url = getUrl(tags, imgLimit, rating)
    pid++
    getResults(`${url}&pid=${pid}`)
    displayPid.innerHTML = `Page ${pid}`
  }
}