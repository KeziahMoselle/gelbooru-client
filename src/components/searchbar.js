const emptyContainer = require('../helpers/emptyContainer')
const { searchBar } = require('../helpers/elements')

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
        if (response.data.length !== 0) {
          let popularTags = response.data
          let list = document.getElementsByClassName('tagResult')
          for (let i = 0; i < list.length; i++) {
            list[i].innerHTML = `${popularTags[i].tag} (${popularTags[i].count})`
          }
        } else {
          let list = document.getElementsByClassName('tagResult')
          for (let i = 0; i < 3; i++) {
            list[i].innerHTML = 'Not found.'
          }
        }
      })
  }
}
