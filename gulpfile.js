const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const format = require('gulp-cssbeautify');
const sass = require('gulp-sass');

// live server
gulp.task('serve', ['sass'], () => {
  browserSync.init({
    server: './src/',
  });

  gulp.watch('src/styles/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html').on('change', browserSync.reload);
});

// compile scss to formatted css
gulp.task('sass', function() {
  return gulp
    .src('src/styles/styles.scss')
    .pipe(sass())
    .pipe(
      format({
        indent: '  ',
        autosemicolon: true,
      })
    )
    .pipe(gulp.dest('src/styles'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
