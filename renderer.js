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
        imgLimit = document.getElementById('imgLimit'), // Select for img limit
        selectCardLayout = document.getElementById('selectCardLayout'), // Select for Card Layout
        displayRating = document.getElementById('displayRating'), // Display Rating
        displayLimit = document.getElementById('displayLimit'), // Display Image limit
        displayLayout = document.getElementById('displayLayout'); // Display Card Layout

  // Value
  var tags;
  var isNsfw = "rating:safe";
  var limit = 10;
  var layout = 'm4';
  // Links
  const linkGelbooru = document.getElementById('linkGelbooru');
  const linkGithub = document.getElementById('linkGithub');

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
      tags = searchBar.value;
      console.log(`Searching images for ${tags} and ${isNsfw}`);
      search(tags, limit, layout);
    }
  };

  // GET VAR

    // Enable NSFW
    enableNsfw.addEventListener('change', () => {
      if (enableNsfw.checked)
      {
        isNsfw = "rating:explicit";
        displayRating.innerHTML = 'lock_open';
        search(tags, limit, layout);
        console.log('Images are now nsfw');
      }
      else
      {
        isNsfw = "rating:safe";
        displayRating.innerHTML = 'lock_outline';
        search(tags, limit, layout);
        console.log('Images are now safe');
      }
    });

    // Image limit
    imgLimit.addEventListener('change', () => {
      limit = imgLimit.value;
      displayLimit.innerHTML = `${limit} images`;
      search(tags, limit, layout);
      console.log(`Image limit is now ${limit}`);
    });

    // Card layout
    selectCardLayout.addEventListener('change', () => {
      layout = selectCardLayout.value;
      switch (layout) {
        case 'm4':
          displayLayout.innerHTML = 'view_module';
        break;

        case 'm6':
          displayLayout.innerHTML = 'view_carousel';
        break;

        case 'm8 offset-m2':
          displayLayout.innerHTML = 'view_agenda';
        break;
      }
      search(tags, limit, layout);
      console.log(`Card layout is now ${layout}`);
    });

  // Light & Dark Mode
    themeBtn.addEventListener('change', () => {
      if (themeBtn.checked)
      { // Si la checkbox est check = on veut le dark mode
        root.classList.add('light-mode');
        
        console.log('Theme : Light mode enabled.');
      }
      else
      { // Si la checkbox n'est pas check on retire le dark mode
        root.classList.remove('light-mode');
        console.log('Theme : Dark mode enabled.');
      }
    });

  // Links
    linkGelbooru.addEventListener('click', (event) => {
      event.preventDefault();
      shell.openExternal('https://gelbooru.com');
    });

    linkGithub.addEventListener('click', (event) => {
      event.preventDefault();
      shell.openExternal('https://github.com/KeziahMoselle/gelbooru-client');
    });





/**
 * GET Request to Gelbooru and display results
 * @param {string} tags 
 * @param {number} limit 
 */
function search(tags, limit = 10, layout)
{
  // If no tags
  if (searchBar.value === "")
    {
      // Empty cards
      clearImg()

      // Display loading...
      displayLoading()

      // GET request
      axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=${limit}&tags=${isNsfw}&json=1`, {})
      .then((response) => {
        // Display images
        response.data.forEach(image => {
          console.log(image);
            container.insertAdjacentHTML('beforeend', `<div class="col s12 ${layout}">
              <div class="card">
                <div class="card-image">
                  <img src="${image.file_url}">
                </div>
                <div class="card-action">
                  <a href="${image.source}">Source</a>
                </div>
              </div>
            </div>`);
        });

        hideLoading()

      }).catch((error) => {
        console.log(error);
        hideLoading()
        container.insertAdjacentHTML('afterbegin', `<div class="card-panel red white-text">
        <span class="white-text">
          ${error}
        </span>
      </div>`);
      });
    }
    else
    { // If tags
      
      // Empty cards
      clearImg()

      // Display loading ...
      displayLoading()

        // Tags replace space -> '+'
        tags.replace(/\s/g, '+');

        // GET request
        axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=${limit}&json=1&tags=${isNsfw}+${tags}`, {})
        .then((response) => { console.log(response);
          if (response.data)
          {
            console.log(response.data);
            hideLoading()
            var i = 0;
            response.data.forEach(image => {
              i++;
              container.insertAdjacentHTML('beforeend', `<div class="col s12 ${layout}">
                <div class="card">
                  <div class="card-image">
                    <img src="${image.file_url}">
                  </div>
                  <div class="card-action">
                    <a href="${image.source}">Source</a>
                  </div>
                </div>
              </div>`)});
              console.log(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=${limit}&json=1&tags=${isNsfw}+${tags}&pid=1`);
              console.log(`Results : ${i}`);
          }
          else
          {
            hideLoading()
            container.insertAdjacentHTML('afterbegin', `<div class="card-panel red white-text">
              <span class="white-text">
                Can't find images for ${tags}
              </span>
            </div>`);
          }
        }).catch((error) => {
          hideLoading()
          container.insertAdjacentHTML('afterbegin', `<div class="card-panel red white-text">
          <span class="white-text">
            ${error}
          </span>
        </div>`);
        });
    }

}

/**
 * Remove all images in container
 */
function clearImg()
{
  while (container.firstChild)
  {
    container.removeChild(container.firstChild);
  }
}

/**
 * Show loading
 */
function displayLoading()
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