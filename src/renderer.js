// Modules
const shell = require('electron').shell,
      remote = require('electron').remote,
      axios = require('axios'),
      Store = require('electron-store'),
      saveFile = remote.require('electron-save-file');

// HTML elements
const root = document.getElementById('root'), // Body
      searchBar = document.getElementById('searchBar'), // Input type text
      loading = document.getElementById('loading'), // Display loading or not
      container = document.getElementById('container'), // Container of images
      displayRating = document.getElementById('displayRating'), // Display Rating
      displayLimit = document.getElementById('displayLimit'), // Display Image limit chip
      displayLayout = document.getElementById('displayLayout'), // Display Card Layout
      displayPid = document.getElementById('displayPid'), // Display chip
      sidenavImageSource = document.getElementById('sidenavImageSource'),
      chips = document.querySelector('.chips'),
      checkboxTheme = document.getElementById('checkboxTheme');

// Value
let tags,
    rating = "rating:safe",
    imgLimit = 10,
    view = 'one_column',
    pid = 1,
    tagsBlacklist = '';

// Store
const store = new Store({
  defaults: {
    theme: 'dark-theme',
    themeCustomization : {
      "primary": "#35385B",
      "accent": "#6688EC",
      "dark": "#242424"
    }
  }
});

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
searchBar.onkeydown = (event) => {
  if (event.keyCode === 13)
  {
    emptyContainer();
    tags = searchBar.value;
    console.log(`Searching images for ${tags} and ${rating}`);
    let url = getUrl(tags, imgLimit, rating);
    getResults(url);
  }
  else
  {
    tags = searchBar.value;
    axios.get(`https://gelbooru.com/index.php?page=dapi&s=tag&q=index&json=1&name_pattern=${tags.replace(/\s/g, '+')}&limit=3&order=DESC&orderby=count`)
    .then((response) => {
      let popularTags = response.data;
      let list = document.getElementsByClassName('tagResult');
      for (let i = 0; i < list.length; i++)
      {
        list[i].innerHTML = `${popularTags[i].tag} (${popularTags[i].count})`;
      }
    });
  }
};

// Refresh
function clickActualize()
{
  emptyContainer();
  tags = searchBar.value;
  console.log(`Actualize with: ${tags} and ${rating}`);
  let url = getUrl(tags, imgLimit, rating);
  getResults(url);
}

// Top images
function searchTop()
{
  tags = 'sort:score'
  emptyContainer();
  let url = getUrl(tags, imgLimit, rating);
  getResults(url);
}

// Hot images
function searchHot()
{
  tags = 'sort:date score:>=5'
  emptyContainer();
  let url = getUrl(tags, imgLimit, rating);
  getResults(url);
}

// Open Blacklist modal
function openBlacklistModal()
{
  const blacklistModal = document.querySelector('#blacklist.modal');
  const instanceBlacklistModal = M.Modal.init(blacklistModal);
  instanceBlacklistModal.open();
}

function openThemeCustomizationModal()
{
  // Get themes colors from the store
  let primaryColor = store.get('themeCustomization.primary'),
      accentColor = store.get('themeCustomization.accent'),
      darkColor = store.get('themeCustomization.dark');
  // Set the color of the three div.preview-color
  document.getElementById('primaryColor-preview').style.backgroundColor = primaryColor;
  document.getElementById('accentColor-preview').style.backgroundColor = accentColor;
  document.getElementById('darkColor-preview').style.backgroundColor = darkColor;
  // Open Modal
  const themeCustomization = document.querySelector('#themeCustomization.modal');
  const instancethemeCustomization = M.Modal.init(themeCustomization);
  instancethemeCustomization.open();
}

// Update 'tagsBlacklist' let
function updateBlacklist()
{
  tagsBlacklist = '';
  let ChipsData = M.Chips.getInstance(chips).chipsData;
  if (ChipsData.length > 1)
  {
    let i = 1;
    ChipsData.forEach(data => {
      if (ChipsData.length === i)
      {
        console.log(data.tag);
        tagsBlacklist += `-${data.tag}`;
      }
      else
      {
        console.log(data.tag);
        tagsBlacklist += `-${data.tag}+`;
      }
      i++;
    });
  }
  else if (ChipsData.length === 1)
  {
    tagsBlacklist += `-${ChipsData[0].tag}`;
  }

  M.toast({html: 'Blacklist updated !'});
}

/*
 *--primary: #35385B;
  --accent: #6688EC;
  --dark: #242424;
 */
function updateTheme()
{
  let primaryColor = document.getElementById('primaryColor').value || store.get(themeCustomization.primary),
      accentColor = document.getElementById('accentColor').value || store.get(themeCustomization.accent),
      darkColor = document.getElementById('darkColor').value || store.get(themeCustomization.dark);
  // Update CSS var
  document.documentElement.style.setProperty('--primary', primaryColor);
  document.documentElement.style.setProperty('--accent', accentColor);
  document.documentElement.style.setProperty('--dark', darkColor);
  // Persist data to the store
  store.set('themeCustomization.primary', primaryColor);
  store.set('themeCustomization.accent', accentColor);
  store.set('themeCustomization.dark', darkColor);
  // Feedback
  M.toast({html: 'The color palette has been updated !'})
}

function resetTheme()
{
  // Update CSS var
  document.documentElement.style.setProperty('--primary', "#35385B");
  document.documentElement.style.setProperty('--accent', "#6688EC");
  document.documentElement.style.setProperty('--dark', "#242424");
  // Persist data to the store
  store.set('themeCustomization.primary', "#35385B");
  store.set('themeCustomization.accent', "#6688EC");
  store.set('themeCustomization.dark', "#242424");
  // Feedback
  M.toast({html: 'The color palette has been restored !'})
}

// Update at launch the theme
  // Get themes colors from the store
  let primaryColor = store.get('themeCustomization.primary'),
      accentColor = store.get('themeCustomization.accent'),
      darkColor = store.get('themeCustomization.dark');
  // Update CSS var
  document.documentElement.style.setProperty('--primary', primaryColor);
  document.documentElement.style.setProperty('--accent', accentColor);
  document.documentElement.style.setProperty('--dark', darkColor);

// Sidenav image details
function openImageDetails(event)
{
  // Fetch image informations with ID
  let image_id = event.target.id;
    axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&id=${image_id}&json=1`)
      .then((response) => {
        // Setting up values
        let image = response.data[0],
            tags = image.tags.split(' ');
        // Update values
        sidenavImageSource.setAttribute('href', `https://gelbooru.com/index.php?page=post&s=view&id=${image.id}`);
        sidenavImageSaveAs.setAttribute('href', `${image.file_url}`);
        sidenavImageDirectory.innerHTML = `<i class="material-icons">folder</i> Directory: ${image.directory}`;
        sidenavImageOwner.innerHTML = `<i class="material-icons">account_circle</i> Owner: ${image.owner}`;
        sidenavImageScore.innerHTML = `<i class="material-icons">show_chart</i> Score: ${image.score}`;
        while (document.getElementById('TagsParent').firstChild)
        {
          document.getElementById('TagsParent').removeChild(document.getElementById('TagsParent').firstChild);
        }
        tags.forEach(tag => {
          document.getElementById('TagsParent').insertAdjacentHTML('beforeend', `
            <li><a class="waves-effect ${isTagInSearchBar(tag) ? 'sidenav-tags-in-searchbar' : 'sidenav-tags-not-in-searchbar'}" id="ADDCLASSTO_${tag}" onclick="handleSidenavTags('${tag}')">${tag}</a></li>
          `);
        });
      });
  // Open sidenav
  const sidenavImageDetails = document.querySelector('#sidenavImageDetails.sidenav');
  const instanceSidenavImageDetails = M.Sidenav.init(sidenavImageDetails);
  instanceSidenavImageDetails.open();
}

// GET rating
function clickRating()
{
  switch (rating) {
    case 'rating:safe': // Switch on Questionable
      displayRating.innerHTML = 'warning';
      rating = 'rating:questionable';
      M.toast({html: `Rating is now ${rating}`});
    break;

    case 'rating:questionable': // Switch on Explicit
      displayRating.innerHTML = 'lock_open';
      rating = 'rating:explicit';
      M.toast({html: `Rating is now ${rating}`});
    break;

    case 'rating:explicit': // Switch on All
      displayRating.innerHTML = 'all_inclusive';
      rating = '';
      M.toast({html: `Rating is now everything`});
    break;

    case '': // Switch on Safe
      displayRating.innerHTML = 'lock_outline';
      rating = 'rating:safe';
      M.toast({html: `Rating is now ${rating}`});
    break;

  }
}

// Change layout view
function clickLayout()
{
  let cardsNodeList = document.getElementsByClassName('card-view');
  let cards = Array.from(cardsNodeList);
  let videosNodeList = document.getElementsByClassName('responsive-video');
  let videos = Array.from(videosNodeList);
  switch (view)
  {
    case 'one_column': // If one_column switch on two_column
      displayLayout.innerHTML = 'view_agenda';
      view = 'two_column';
      container.classList.remove('card-container');
      if(cards.length >= 1)
      {
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
  M.toast({html: `Image limit is now ${imgLimit}`})
}

  // Light & Dark Mode

    let lastTheme = store.get('theme');

    // Enable light theme if enabled before
    if (lastTheme === 'light-mode')
    {
      root.classList.add('light-mode');
      checkboxTheme.setAttribute('checked', 'checked');
      console.log('Theme : Light mode enabled.');
    }

    // Add / Remove light theme
    function handleTheme()
    {
      let actualTheme = store.get('theme');
      if (actualTheme === 'light-mode')
      { // Actual theme = Light Mode -> Switch on Dark Mode
        root.classList.remove('light-mode');
        M.toast({html: 'Dark theme activated'});
        store.set('theme','dark-mode');
      }
      else
      { // Actual theme = Dark Mode -> Switch on Light Mode
        root.classList.add('light-mode');
        M.toast({html: 'Light theme activated'});
        store.set('theme','light-mode');
      }
    }

    function handleSidenavTags(tag)
    {
      // Add the tag to the search bar and actualize
      if (!isTagInSearchBar(tag))
      {
        searchBar.value = `${searchBar.value} ${tag}`;
        let element = document.getElementById(`ADDCLASSTO_${tag}`).classList.add('sidenav-tags-in-searchbar');
        clickActualize();
        M.toast({html: `Added ${tag}.`})
      }
      else
      {
        let tags = searchBar.value;
        searchBar.value = tags.replace(tag, '');
        let element = document.getElementById(`ADDCLASSTO_${tag}`).classList.remove('sidenav-tags-in-searchbar');
        clickActualize();
        M.toast({html: `Removed ${tag}`})
      }
    }

  // Handle links
    document.addEventListener('click', (event) => {
      if (event.target.tagName === 'A')
      {
        if (event.target.href.startsWith('https://gelbooru.com/') || event.target.href.startsWith('https://github.com/'))
        {
          event.preventDefault();
          shell.openExternal(event.target.href);
        }
        else if (event.target.id === 'sidenavImageSaveAs')
        {
          event.preventDefault();
          saveFile(event.target.href)
            .then(() => {
              M.toast({html: 'Picture saved !'})
            }).catch(error => M.toast({html: error.stack}));
        }
      }
      else if (event.target.localName === 'img' && event.target.className != 'no-content-img')
      {
        openImageDetails(event);
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
          let sample_url;
          if (image.sample)
          {
            sample_url = `https://simg3.gelbooru.com//samples/${image.directory}/sample_${image.hash}.jpg`;
          }
          if (tags.includes('webm'))
          {
            container.insertAdjacentHTML('beforeend', `
            <video class="responsive-video" controls loop>
              <source src="${image.file_url}" type="video/webm">
            </video>`)
          }
          else
          {
            container.insertAdjacentHTML('beforeend', `<div class="card-view">
              <div class="card">
                <div class="card-image">
                  <img id="${image.id}" src="${isSampleExist(sample_url) ? sample_url : image.file_url}">
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
  let url = `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=${imgLimit}&tags=${rating}`;
  if (tags.length > 0)
  {
    url += `+${tags.replace(/\s/g, '+')}`;
  }
  if (tagsBlacklist.length > 0)
  {
    url += `+${tagsBlacklist}`;
  }
  if (!tags.includes('webm'))
  {
    url += `+-webm`;
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
    return true;
  }
  else
  {
    return false;
  }
}

function isTagInSearchBar(tag)
{
  let tags = searchBar.value;
  if (tags.includes(tag))
  {
    return true;
  }
  else
  {
    return false;
  }
}