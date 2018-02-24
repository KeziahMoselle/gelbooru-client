const gulp = require('gulp');
const electron = require('electron-connect').server.create();

gulp.task('default', () => {
  
  electron.start();

  gulp.watch('main.js', electron.restart);

  gulp.watch(['./src/index.html', './src/renderer.js', './src/Store.js', './src/assets/css/index.css'], electron.reload);
});