/**
 * Return a valid URL with parameters
 *
 * @param {string} [tags=''] Tags
 * @param {number} [imgLimit=10] The imgLimit by default is 10
 * @param {string} [rating='rating:safe'] Rating by default is safe
 * @param {number} [pid=1] Initial page 1
 * @returns {string} Final URL
 */
module.exports = function (tags = '', imgLimit = 10, rating = 'rating:safe', pid = 1) {
  let url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=${imgLimit}&tags=${rating}`
  if (tags.length > 0) {
    url += `+${tags.replace(/\s/g, '+')}`
  }
  if (tagsBlacklist.length > 0) {
    url += `+${tagsBlacklist}`
  }
  if (pid !== 1) {
    url += `&pid=${pid}`
  }
  console.log(`getUrl() has returned ${url}`)
  return url
}
