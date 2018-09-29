￼

￼

Gelbooru Client
An Electron app for Gelbooru.

￼

￼

￼

￼

￼

Features
• [x] Search images (10 to 100 per request)
• [x] Browse all, see Top images and Hot images
• [x] Rating (Safe, Explicit, Questionable)
• [x] Blacklist (Exclude tags)
• [x] 3 cards layout
• [x] Advanced Theme Customization
• [x] Download an image
• [x] Endless scrolling

Features incoming
• [ ] Gallery mode
• [ ] Download all visible images

Download

Note: gelbooru-client is developped on Windows, but you can follow the Installing part to build it on your platform, it should work. If not please create an issue .


Head to Release tab, and download the version you want.

Installing

> git clone https://github.com/KeziahMoselle/gelbooru-client.git



Install dependencies :

> cd gelbooru-client && npm install



To run the app (with hot reload):

> npm start



Your code must follow the standardjs rules :

> npm test



Build

> npm run dist



The binaries will be created in the dist folder.

Built With
• Electron - framework for creating native applications with web technologies
• Axios - Promise based HTTP client for the browser and node.js
• MaterializeCSS - A modern responsive front-end framework based on Material Design
• Gelbooru API - An image board based on Danbooru
• Undraw Illustrations - Illustrations under MIT License

License

gelbooru-client is licensed under the MIT License .