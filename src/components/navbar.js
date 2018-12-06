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
