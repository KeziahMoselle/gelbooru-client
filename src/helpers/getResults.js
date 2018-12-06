const axios = require('axios')
const container = document.getElementById('container')

/**
 * Show loading
 * Finished: Append cards to the container
 * Hide loading
 *
 * @param {string} url
 */
module.exports = function (url) {
  axios.get(url)
    .then((response) => {
      if (response.data) {
        response.data.forEach(image => {
          const sampleUrl = image.sample === true ? `https://simg3.gelbooru.com//samples/${image.directory}/sample_${image.hash}.jpg` : false
          if (image.file_url.split('.')[3] === 'webm') {
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
