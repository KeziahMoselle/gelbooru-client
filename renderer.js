// Modules

  // Electron
  const shell = require('electron').shell;
  const remote = require('electron').remote;

  // Axios
  const axios = require('axios');

// Var

  // HTML elements
  const root = document.getElementById('root'); // 
  const searchBar = document.getElementById('searchBar'); // Input type text
  const searchBtn = document.getElementById('searchBtn'); // Input type btn
  const loading = document.getElementById('loading'); // Display loading or not
  const container = document.getElementById('container'); // Container of images
  const themeBtn = document.getElementById('themeBtn'); // Checkbox for theme
  const imgLimit = document.getElementById('imgLimit'); // Select for img limit
  const selectCardLayout = document.getElementById('selectCardLayout'); // Select for Card Layout
  // Value
  var limit = 10;
  var layout = 'm4';
  // Links
  const linkGelbooru = document.getElementById('linkGelbooru');

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
      let tags = searchBar.value;
      search(tags, limit, layout);
    }
  };

  // BTN
  searchBtn.addEventListener('click', () => {
    let tags = searchBar.value;
    search(tags, limit, layout);
  });

  // LIMIT VAR
  imgLimit.addEventListener('change', () => {
    limit = imgLimit.value;
    console.log(limit);
  });

  // LAYOUT VAR
  selectCardLayout.addEventListener('change', () => {
    layout = selectCardLayout.value;
    console.log(layout);
  });

  // Light & Dark Mode
  themeBtn.addEventListener('change', () => {
    if (themeBtn.checked)
    { // Si la checkbox est check = on veut le dark mode
      root.classList.add('light-mode');
      
      console.log('Light mode !');
    }
    else
    { // Si la checkbox n'est pas check on retire le dark mode
      root.classList.remove('light-mode');
      console.log('Dark mode !');
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

  if (searchBar.value === "")
    {
      // Empty cards
      while (container.firstChild)
      {
        container.removeChild(container.firstChild);
      }

      // Display loading...
      loading.classList.remove('hide');

      // GET request
      axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=${limit}&json=1&pid=1`, {})
      .then((response) => {
        // Display images
        response.data.forEach(image => {
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

        // Hide loading ...
        loading.classList.add('hide');

      }).catch((error) => {
        console.log(error);
        loading.classList.add('hide');
        container.insertAdjacentHTML('afterbegin', `<div class="card-panel red white-text">
        <span class="white-text">
          ${error}
        </span>
      </div>`);
      });
    }
    else
    {
      // Empty cards
      while (container.firstChild)
      {
        container.removeChild(container.firstChild);
      }

      // Display loading ...
      loading.classList.remove('hide');

        // Tags replace space -> '+'
        tags.replace(/\s/g, '+');

        // GET request
        axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=${limit}&json=1&tags=${tags}&pid=1`, {})
        .then((response) => {
          if (response.data)
          {
            loading.classList.add('hide');
            response.data.forEach(image => {
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
          }
          else
          {
            loading.classList.add('hide');
            container.insertAdjacentHTML('afterbegin', `<div class="card-panel red white-text">
              <span class="white-text">
                Can't find images for ${tags}
              </span>
            </div>`);
          }
        }).catch((error) => {
          loading.classList.add('hide');
          container.insertAdjacentHTML('afterbegin', `<div class="card-panel red white-text">
          <span class="white-text">
            ${error}
          </span>
        </div>`);
        });
    }

}