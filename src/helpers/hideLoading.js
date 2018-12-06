const loading = document.getElementById('loading')

/**
 * Hide loading
 */
function hideLoading () {
  loading.classList.add('hide')
}

/**
 * Show loading
 */
function showLoading () {
  loading.classList.remove('hide')
}

module.exports = {
  hideLoading,
  showLoading
}
