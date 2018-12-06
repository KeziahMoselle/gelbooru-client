/**
 * Remove all images in container
 */
module.exports = function () {
  const container = document.getElementById('container')
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
}
