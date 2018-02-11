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
        cardContainer = document.querySelector('div.card-container'); // Masonry or not

  // Value
  var tags,
      isNsfw = "rating:safe",
      limit = 10,
      layout = 'm4';
  // Links
  const linkGelbooru = document.getElementById('linkGelbooru'),
        linkGithub = document.getElementById('linkGithub');

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

  // Change values by clicking on it 
  clickRating.addEventListener('click', () => {
    if (isNsfw === 'rating:safe')
    {
      displayRating.innerHTML = 'lock_open';
      isNsfw = 'rating:explicit';
      console.log(isNsfw);
      search(tags, limit, layout);
    }
    else
    {
      displayRating.innerHTML = 'lock_outline';
      isNsfw = 'rating:safe';
      console.log(isNsfw);
      search(tags, limit, layout);
    }
  });

  clickLayout.addEventListener('click', () => {
      switch (layout)
      {
        case 'm4': // If m4 switch on m6
          displayLayout.innerHTML = 'view_agenda';
          layout = 'm6';
          search(tags, limit, layout);
        break;

        case 'm6': // if m6 switch on m8 offset-m2
          displayLayout.innerHTML = 'view_carousel';
          layout = 'm8 offset-m2';
          search(tags, limit, layout);
        break;

        case 'm8 offset-m2': // if m8 offset-m2 switch on m4
          displayLayout.innerHTML = 'view_module';
          layout = 'm4';
          search(tags, limit, layout);
        break;
      }
  });

  clickLimit.addEventListener('click', () => {
    console.log(limit);
    switch (limit)
    {
      case 10: // If 10 switch on 20
        displayLimit.innerHTML = '20 images';
        limit = 20;
        search(tags, limit, layout);
      break;

      case 20: // If 20 switch on 50
        displayLimit.innerHTML = '50 images';
        limit = 50;
        search(tags, limit, layout);
      break;

      case 50: // If 50 switch on 100
        displayLimit.innerHTML = '100 images';
        limit = 100;
        search(tags, limit, layout);
      break;

      case 100: // If 100 switch on 10
        displayLimit.innerHTML = '10 images';
        limit = 10;
        search(tags, limit, layout);
      break;
    }
  });

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
      switch (layout)
      {
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
function search(tags, limit, layout)
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
        hideLoading()
            var i = 0;
            console.log(layout);
            if (layout != 'm4') // Show with grid
            {
              cardContainer['id'] = 'null';
              console.log('with grid');
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
              console.log(`Results : ${i}`);
              hideLoading();
            }
            else // m4 -> masonry
            {
              cardContainer.id = "container";
              console.log('masonry');
              response.data.forEach(image => {
                container.insertAdjacentHTML('beforeend', `<div class="card">
                      <div class="card-image">
                        <img src="${image.file_url}">
                      </div>
                      <div class="card-action">
                        <a href="${image.source}">Source</a>
                      </div>
                    </div>`);
              });
              hideLoading();
            }
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
        .then((response) => {
          if (response.data)
          {
            hideLoading()
            var i = 0;
            if (layout != 'm4') // Show with grid
            {
              cardContainer['id'] = 'null';
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
              console.log(`Results : ${i}`);
              hideLoading();
            }
            else // m4 -> masonry
            {
              cardContainer['id'] = 'container';
              response.data.forEach(image => {
                container.insertAdjacentHTML('beforeend', `<div class="card">
                      <div class="card-image">
                        <img src="${image.file_url}">
                      </div>
                      <div class="card-action">
                        <a href="${image.source}">Source</a>
                      </div>
                    </div>`);
              });
              hideLoading();
            }
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