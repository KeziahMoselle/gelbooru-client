<p align="center">
  <a href="build/icon-black.png">
    <img src="https://i.imgur.com/OmhYzTa.png" height="150">
    <img src="https://i.imgur.com/r4Q1hjF.png" height="150">
  </a>

  <h3 align="center">Gelbooru Client</h3>

  <p align="center">
    An Electron app for Gelbooru.
    <br>
    <br>
    <a href="https://ci.appveyor.com/project/KeziahMoselle/gelbooru-client">
      <img src="https://img.shields.io/appveyor/ci/KeziahMoselle/gelbooru-client.svg?style=for-the-badge" alt="AppVeyor Badge">
    </a>
    <a href="https://github.com/KeziahMoselle/gelbooru-client/releases">
      <img src="https://img.shields.io/github/release-date-pre/KeziahMoselle/gelbooru-client.svg?style=for-the-badge" alt="Last release Badge">
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/apm/l/vim-mode.svg?style=for-the-badge" alt="License Badge">
    </a>
</p>

<img src="./src/assets/preview.gif">

## Features

* [x] Search images (10 to 100 per request)
* [x] 3 cards layout
* [x] Dark & Light mode
* [x] Rating (Safe, Explicit, Questionable)
* [x] Pagination
* [x] Save image
* [x] Browse all
* [x] Top images
* [x] Hot images
* [x] Blacklist (Exclude tags)
* [ ] Endless scrolling

## Installing

```sh
> git clone https://github.com/KeziahMoselle/gelbooru-client.git
```
Install dependencies :
```sh
> cd gelbooru-client && npm install
```
To run the app :
```sh
> npm start
```

To run the app with live reload :
```sh
> npx gulp
```

## Build

```sh
> npm run dist
```
A `dist` folder should be created with `win-unpacked` and `gelbooru-client Setup version.exe`.

## Built With

* [Electron](https://electronjs.org/) - framework for creating native applications with web technologies
* [Axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js
* [MaterializeCSS](http://next.materializecss.com/) - A modern responsive front-end framework based on Material Design
* [Gelbooru API](https://gelbooru.com/index.php?page=help&topic=dapi) - An image board based on Danbooru


## License

gelbooru-client is licensed under the [MIT License](LICENSE).
