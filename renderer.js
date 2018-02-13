// Modules
  const shell = require('electron').shell,
        remote = require('electron').remote,
        axios = require('axios');

// Var
  // HTML elements
  const root = document.getElementById('root'), // Body
        searchBar = document.getElementById('searchBar'), // Input type text
        loading = document.getElementById('loading'), // Display loading or not
        container = document.getElementById('container'), // Container of images
        enableNsfw = document.getElementById('enableNsfw'), // Checkbox for nsfw
        themeBtn = document.getElementById('themeBtn'), // Checkbox for theme
        displayRating = document.getElementById('displayRating'), // Display Rating
        displayLimit = document.getElementById('displayLimit'), // Display Image limit chip
        displayLayout = document.getElementById('displayLayout'), // Display Card Layout
        displayPid = document.getElementById('displayPid'), // Display chip
        cardContainer = document.querySelector('div.card-container'); // Masonry or not

  // Value
  var tags,
      rating = "rating:safe",
      imgLimit = 10,
      view = 'm4'
      pid = 1;

// Events

  // Window events
    // Minimize
    document.getElementById('win-minimize').addEventListener('click', (event) => {
      let window = remote.getCurrentWindow();
      window.minimize();
    });

    // Fullscreen
    document.getElementById('win-fullscreen').addEventListener('click', (event) => {
      let window = remote.getCurrentWindow();
      if (!window.isMaximized())
      {
        window.maximize();
      }
      else
      {
        window.unmaximize();
      }
    });

    // Close
    document.getElementById('win-close').addEventListener('click', (event) => {
      let window = remote.getCurrentWindow();
      window.close();
    });


  // INPUT AND HIT ENTER
  searchBar.onkeypress = (event) => {
    if (event.keyCode === 13)
    {
      emptyContainer();
      tags = searchBar.value;
      console.log(`Searching images for ${tags} and ${rating}`);
      var url = getUrl(tags, imgLimit, rating);
      getResults(url);
    }
  };

  // GET rating
  function clickRating()
  {
    if (rating === 'rating:safe')
    {
      displayRating.innerHTML = 'lock_open';
      rating = 'rating:explicit';
      console.log(`Rating is now ${rating}`);
    }
    else
    {
      displayRating.innerHTML = 'lock_outline';
      rating = 'rating:safe';
      console.log(`Rating is now ${rating}`);
    }
  }

  // Change layout view
  function clickLayout()
  {
    var cardsNodeList = document.getElementsByClassName('card-view');
    var cards = Array.from(cardsNodeList);
    switch (view)
    {
      case 'm4': // If m4 switch on m6
        displayLayout.innerHTML = 'view_agenda';
        view = 'm6';
        container.classList.remove('card-container');
        if(cards)
        {
          cards.forEach(card => {
            container.classList.remove('card-column-3');
            container.classList.add('card-column-2');
          });
        }
        else
        {
          console.log('No cards');
        }
      break;

      case 'm6': // if m6 switch on m8 offset-m2
        displayLayout.innerHTML = 'view_carousel';
        view = 'm8 offset-m2';
        container.classList.remove('card-container');
        if(cards)
        {
          cards.forEach(card => {
            container.classList.remove('card-column-2');
            container.classList.add('card-column-1');
          });
        }
        else
        {
          console.log('No cards');
        }
      break;

      case 'm8 offset-m2': // if m8 offset-m2 switch on m4
        displayLayout.innerHTML = 'view_module';
        view = 'm4';
        container.classList.add('card-container');
        if(cards)
        {
          cards.forEach(card => {
            container.classList.remove('card-column-1');
            container.classList.add('card-column-3');
          });
        }
        else
        {
          console.log('No cards');
        }
      break;
    }
  }

  // GET imgLimit
  function clickLimit()
  {
    switch (imgLimit)
    {
      case 10: // If 10 switch on 20
        displayLimit.innerHTML = '20 images';
        imgLimit = 20;
      break;

      case 20: // If 20 switch on 50
        displayLimit.innerHTML = '50 images';
        imgLimit = 50;
      break;

      case 50: // If 50 switch on 100
        displayLimit.innerHTML = '100 images';
        imgLimit = 100;
      break;

      case 100: // If 100 switch on 10
        displayLimit.innerHTML = '10 images';
        imgLimit = 10;
      break;
    }
    console.log(imgLimit);
  }

  // Light & Dark Mode
    themeBtn.addEventListener('change', () => {
      if (themeBtn.checked)
      {
        root.classList.add('light-mode');
        
        console.log('Theme : Light mode enabled.');
      }
      else
      {
        root.classList.remove('light-mode');
        console.log('Theme : Dark mode enabled.');
      }
    });

  // Handle links
    document.addEventListener('click', (event) => {
      if (event.target.tagName === 'A' && event.target.href.startsWith('http'))
      {
        event.preventDefault();
        shell.openExternal(event.target.href);
      }
    });


  
/**
 * Show loading
 * Finished: Append cards to the container
 * Hide loading
 * 
 * @param {string} url 
 */
function getResults(url)
{
  showLoading();

  axios.get(url)
    .then((response) => {
      if (response.data)
      { // We find results
        hideLoading();
        response.data.forEach(image => {
          container.insertAdjacentHTML('beforeend', `<div class="card-view">
            <div class="card">
              <div class="card-image">
                <img src="${image.file_url}">
              </div>
              <div class="card-action">
                <a href="https://gelbooru.com/index.php?page=post&s=view&id=${image.id}">Source</a>
              </div>
            </div>
          </div>`);
        });
      }
      else
      { // We don't find any results
        hideLoading();
        alert('Any results was found');
        return;
      }
    })
}

function clickNext()
{
  pid++;
  displayPid.innerHTML = `Page ${pid}`;
  emptyContainer();
  let url = getUrl(tags, imgLimit, rating, pid);
  getResults(url);
}

function clickPrevious()
{
  pid--;
  displayPid.innerHTML = `Page ${pid}`;
  emptyContainer();
  let url = getUrl(tags, imgLimit, rating, pid);
  getResults(url);
}

/**
 * Return a valid URL with parameters
 * 
 * @param {string} [tags=''] Tags
 * @param {number} [imgLimit=10] The imgLimit by default is 10
 * @param {string} [rating='rating:safe'] Rating by default is safe
 * @param {number} [pid=1] Initial page 1
 * @returns {string} Final URL
 */
function getUrl(tags = '', imgLimit = 10, rating = 'rating:safe', pid = 1)
{
  var url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=${imgLimit}`;
  if (tags != '')
  {
    url += `&tags=${tags.replace(/\s/g, '+')}`;
    url += `+${rating}`;
  }
  else
  {
    url += `&tags=${rating}`;
  }
  if (pid != 1)
  {
    url += `&pid=${pid}`;
  }
  console.log(`getUrl has returned ${url}`);
  return url;
}

/**
 * Remove all images in container
 */
function emptyContainer()
{
  while (container.firstChild)
  {
    container.removeChild(container.firstChild);
  }
}

/**
 * Show loading
 */
function showLoading()
{
  loading.classList.remove('hide');
}

/**
 * Hide loading
 */
function hideLoading()
{
  loading.classList.add('hide');
}