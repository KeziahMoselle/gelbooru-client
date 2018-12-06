// GET rating
document.getElementById('ratingBtn').addEventListener('click', (event) => {
  event.preventDefault()
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
document.getElementById('layoutBtn').addEventListener('click', (event) => {
  event.preventDefault()
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
document.getElementById('limitBtn').addEventListener('click', (event) => {
  event.preventDefault()
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
document.getElementById('openBlacklistModalBtn').addEventListener('click', (event) => {
  event.preventDefault()
  const blacklistModal = document.querySelector('#blacklist.modal')
  const instanceBlacklistModal = M.Modal.init(blacklistModal)
  instanceBlacklistModal.open()
})

// Materialize

const sidenav = document.querySelector('.sidenav')
const instanceSidenav = M.Sidenav.init(sidenav)

document.getElementById('openSidenav').addEventListener('click', (event) => {
  event.preventDefault()
  instanceSidenav.open()
})

const chips = document.querySelector('.chips')
M.Chips.init(chips, {
  placeholder: 'Press enter'
})

// Animations
const clickSearch = document.getElementById('clickSearch')
const navSearch = document.querySelector('nav#nav-search')
const main = document.querySelector('main.row')

let marginTop = 0
clickSearch.addEventListener('click', () => {
  if (marginTop === 0) {
    marginTop = 70
    navSearch.style.marginTop = '70px'
    main.style.paddingTop = '148px'
    document.getElementById('searchBar').focus()
  } else {
    marginTop = 0
    main.style.paddingTop = '90px'
    navSearch.style.marginTop = '0px'
  }
})

document.getElementById('closeSearchBar').addEventListener('click', (event) => {
  event.preventDefault()
  marginTop = 0
  main.style.paddingTop = '90px'
  navSearch.style.marginTop = '0px'
})
