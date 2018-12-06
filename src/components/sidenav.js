// Sidenav image details
function openImageDetails (event) {
  event.preventDefault()
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

// Add tag dynamically via sidenav
document.getElementById('TagsParent').addEventListener('click', (event) => {
  event.preventDefault()
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