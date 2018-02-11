# Gelbooru Client 

An Electron app for Gelbooru

[![AppVeyor](https://img.shields.io/appveyor/ci/KeziahMoselle/gelbooru-client.svg?style=for-the-badge)](https://ci.appveyor.com/project/KeziahMoselle/gelbooru-client)
[![GitHub (Pre-)Release Date](https://img.shields.io/github/release-date-pre/KeziahMoselle/gelbooru-client.svg?style=for-the-badge)](https://github.com/KeziahMoselle/gelbooru-client/releases)
[![apm](https://img.shields.io/apm/l/vim-mode.svg?style=for-the-badge)]()

<img src="/assets/preview.gif">

## Features

* [x] Search images (10 to 100)
* [x] 3 cards layout
* [x] Dark & Light mode
* [x] Rating (Safe or Explicit)
* [ ] Pagination
* [ ] Save image

## Installing

```sh
git clone https://github.com/KeziahMoselle/gelbooru-client.git
```
Install dependencies :
```sh
cd gelbooru-client && npm install
```
To run the app :
```sh
npm start
```

## Build

```sh
npm run dist
```

## Built With

* [Electron](https://electronjs.org/) - framework for creating native applications with web technologies
* [Axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js
* [MaterializeCSS](http://next.materializecss.com/) - A modern responsive front-end framework based on Material Design
* [Gelbooru API](https://gelbooru.com/index.php?page=help&topic=dapi) - An image board based on Danbooru


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
