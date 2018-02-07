// Modules

  // Electron
  const shell = require('electron').shell;
  const remote = require('electron').remote;

  // Axios
  const axios = require('axios');


// Var

  // API URL
  const apiUrl = (parameters) => {
    return `https://gelbooru.com/index.php?page=dapi&s=post&q=index&limit=10&json=1&tags=${parameters}&pid=1`;
  };
  // HTML elements
  const body = document.getElementsByTagName('body'); // 
  const searchBar = document.getElementById('searchBar'); // Input type text
  const searchBtn = document.getElementById('searchBtn'); // Input type btn
  const loading = document.getElementById('loading'); // Display loading or not
  const container = document.getElementById('container'); // Container of images
  const themeBtn = document.getElementById('themeBtn'); // Checkbox for theme
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

  // Permet de récupérer 10 images avec des tags
  searchBar.onkeypress = (event) => {
    if (event.keyCode === 13)
    {
      event.preventDefault();
      if (searchBar.value === "")
        return;
      // On enlève la classe "hide" du loading pour qu'il s'affiche
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      loading.classList.remove('hide');
      // Fetching
        // On récupère la valeur des tags 
        let tags = searchBar.value;
        // On remplace les espaces par des '+'
        tags.replace(/\s/g, '+');
        // On exécute la requête
        axios.get(apiUrl(tags), {})
        .then((response) => {
          // On affiche les images
          response.data.forEach(image => {
              container.insertAdjacentHTML('beforeend', `<div class="col s12 m4">
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
          // On enlève le loading
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
  };

  // Permet de récupérer 10 images avec des tags grâce au btn
  searchBtn.addEventListener('click', () => {
    if (searchBar.value === "")
        return;
      // On enlève la classe "hide" du loading pour qu'il s'affiche
      loading.classList.remove('hide');
      // Fetching
        // On récupère la valeur des tags 
        let tags = searchBar.value;
        // On remplace les espaces par des '+'
        tags.replace(/\s/g, '+');
        // On exécute la requête
        axios.get(apiUrl(tags), {})
        .then((response) => {
          // On affiche les images
          response.data.forEach(image => {
              container.insertAdjacentHTML('beforeend', `<div class="col s12 m4">
                <div class="card">
                  <div class="card-image">
                    <img src="${image.file_url}">
                    <span class="card-title">Card Title</span>
                  </div>
                  <div class="card-action">
                    <a href="${image.source}">Source</a>
                  </div>
                </div>
              </div>`);
          });
          // On enlève le loading
          loading.classList.add('hide');
        }).catch((error) => {
          console.log(error);
        });
  });

  // Light & Dark Mode
  themeBtn.addEventListener('change', () => {
    if (this.checked)
    { // Si la checkbox est check = on veut le dark mode
      body.classList.add('light-mode');
    }
    else
    { // Si la checkbox n'est pas check on retire le dark mode
      body.classList.remove('light-mode');
    }
  });


  // Links
  linkGelbooru.addEventListener('click', (event) => {
    shell.openExternal('https://gelbooru.com/');
  });