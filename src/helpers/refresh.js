const emptyContainer = require('../functions/emptyContainer')
const getUrl = require('../functions/getUrl')
const getResults = require('../functions/getResults')
const searchBar = document.getElementById('searchBar')

module.exports = function () {
  emptyContainer()
  tags = searchBar.value
  console.log(`Actualize with: ${tags} and ${rating}`)
  let url = getUrl(tags, imgLimit, rating)
  getResults(url)
}
