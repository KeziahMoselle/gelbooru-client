// Modules
  const shell = require('electron').shell,
        remote = require('electron').remote,
        axios = require('axios'),
        saveFile = remote.require('electron-save-file'),
        Store = require('./Store');

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
        tagsResults = document.getElementById('tagsResults');

  // Value
  var tags,
      rating = "rating:safe",
      imgLimit = 10,
      view = 'one_column'
      pid = 1;

// Store

const store = new Store({
  configName: 'settings',
  defaults: {
    theme: ''
  }
});

var theme = store.get('theme');

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
    else
    {
      tags = searchBar.value;
      axios.get(`https://gelbooru.com/index.php?page=dapi&s=tag&q=index&json=1&name_pattern=${tags.replace(/\s/g, '+')}&limit=3&order=DESC&orderby=count`)
      .then((response) => {
        var popularTags = response.data;
        var list = document.getElementsByClassName('tagResult');
        for (let i = 0; i < list.length; i++)
        {
          list[i].innerHTML = `${popularTags[i].tag} (${popularTags[i].count})`;
        }
      });
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
    var videosNodeList = document.getElementsByClassName('responsive-video');
    var videos = Array.from(videosNodeList);
    switch (view)
    {
      case 'one_column': // If one_column switch on two_column
        displayLayout.innerHTML = 'view_agenda';
        view = 'two_column';
        container.classList.remove('card-container');
        if(cards.length >= 1)
        {
          console.log(cards);
          cards.forEach(card => {
            container.classList.remove('card-column-3');
            container.classList.add('card-column-2');
          });
        }
        else if (videos.length >= 1)
        {
          console.log(videos);
          videos.forEach(video => {
            container.classList.remove('card-column-3');
            container.classList.add('card-column-2');
          });
        }
        else
        {
          console.log('No cards');
        }
      break;

      case 'two_column': // if two_column switch on three_column
        displayLayout.innerHTML = 'view_carousel';
        view = 'three_column';
        container.classList.remove('card-container');
        if(cards.length >= 1)
        {
          cards.forEach(card => {
            container.classList.remove('card-column-2');
            container.classList.add('card-column-1');
          });
        }
        else if (videos.length >= 1)
        {
          videos.forEach(video => {
            container.classList.remove('card-column-2');
            container.classList.add('card-column-1');
          });
        }
        else
        {
          console.log('No cards');
        }
      break;

      case 'three_column': // if three_column switch on one_column
        displayLayout.innerHTML = 'view_module';
        view = 'one_column';
        container.classList.add('card-container');
        if(cards.length >= 1)
        {
          cards.forEach(card => {
            container.classList.remove('card-column-1');
            container.classList.add('card-column-3');
          });
        }
        else if (videos.length >= 1)
        {
          videos.forEach(video => {
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
    console.log(`Image limit is now ${imgLimit}`);
  }

  // Light & Dark Mode
    if (theme === 'light-mode')
    {
      root.classList.add('light-mode');
      themeBtn.checked = true;
      console.log('Theme : Light mode enabled.');
    }

    themeBtn.addEventListener('change', () => {
      if (themeBtn.checked)
      {
        root.classList.add('light-mode');
        store.set('theme','light-mode');
        console.log('Theme : Light mode enabled.');
      }
      else
      {
        root.classList.remove('light-mode');
        store.set('theme','dark-mode');
        console.log('Theme : Dark mode enabled.');
      }
    });

  // Handle links
    document.addEventListener('click', (event) => {
      if (event.target.tagName === 'A')
      {
        if (event.target.href.startsWith('https://gelbooru.com/') || event.target.href.startsWith('https://github.com/'))
        {
          event.preventDefault();
          shell.openExternal(event.target.href);
        }
      }
      else if (event.target.tagName === 'A' && event.target.href.startsWith('https://simg3.gelbooru.com/'))
      {
        event.preventDefault();
        saveFile(event.target.href)
          .then()
          .catch(err => console.error(err.stack));
      }
    });


    // Pagination
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
      if (pid > 1)
      {
        pid--;
        displayPid.innerHTML = `Page ${pid}`;
        emptyContainer();
        let url = getUrl(tags, imgLimit, rating, pid);
        getResults(url);
      }
    }


  
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
          var sample_url;
          if (image.sample)
          {
            sample_url = `https://simg3.gelbooru.com//samples/${image.directory}/sample_${image.hash}.jpg`;
          }
          if (tags.includes('webm'))
          {
            container.insertAdjacentHTML('beforeend', `
            <video class="responsive-video" controls>
              <source src="${image.file_url}" type="video/webm">
            </video>`)
          }
          else
          {
            container.insertAdjacentHTML('beforeend', `<div class="card-view">
              <div class="card">
                <div class="card-image">
                  <img src="${isSampleExist(sample_url) ? sample_url : image.file_url}">
                </div>
                <div class="card-action">
                  <a href="https://gelbooru.com/index.php?page=post&s=view&id=${image.id}">Source</a>
                  <a href="${image.file_url}">Save as</a>
                </div>
              </div>
            </div>`);
          }
          
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
    if (tags.includes('webm'))
    {
      url += `&tags=${tags.replace(/\s/g, '+')}`;
      url += `+${rating}`;
    }
    else
    {
      url += `&tags=${tags.replace(/\s/g, '+')}`;
      url += `+${rating}-webm`;
    }
  }
  else
  {
    url += `&tags=${rating}`;
  }
  if (pid != 1)
  {
    url += `&pid=${pid}`;
  }
  console.log(`getUrl() has returned ${url}`);
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

function isSampleExist(sample_url)
{
  if (sample_url)
  {
    console.log(`Sample exist: ${sample_url}`);
    return true;
  }
  else
  {
    console.log(`Sample doesn't exist: ${sample_url}`);
    return false;
  }
}