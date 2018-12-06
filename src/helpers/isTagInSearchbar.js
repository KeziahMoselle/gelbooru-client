module.exports = function (tag) {
  let tags = searchBar.value
  if (tags.includes(tag)) {
    return true
  } else {
    return false
  }
}
