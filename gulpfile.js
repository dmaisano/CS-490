const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const format = require('gulp-cssbeautify');
const sass = require('gulp-sass');
const path = require('path');

const staticDir = path.join(__dirname, './public');

// live server
gulp.task('serve', ['sass'], () => {
  browserSync.init({
    open: false,
    proxy: 'http://localhost:4200',
    serveStatic: [
      {
        route: '/public',
        dir: staticDir,
      },
    ],
  });

  gulp.watch(`${staticDir}/styles/**/*.scss`, ['sass']);
  gulp.watch(`${staticDir}/**/*.html`).on('change', browserSync.reload);
});

// compile scss to formatted css
gulp.task('sass', function() {
  return gulp
    .src(`${staticDir}/styles/styles.scss`)
    .pipe(sass())
    .pipe(
      format({
        indent: '  ',
        autosemicolon: true,
      })
    )
    .pipe(gulp.dest(`${staticDir}/styles`))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
