
var fs = require('fs');
var gulp = require('gulp');
var basswork = require('gulp-basswork');
var rename = require('gulp-rename');
var mincss = require('gulp-minify-css');
var marked = require('gulp-marked');
var markedExample = require('marked-example');
var header = require('gulp-header');
var footer = require('gulp-footer');

gulp.task('css', function() {
  gulp.src('./index.css')
    .pipe(basswork())
    .pipe(rename('flex-object.css'))
    .pipe(gulp.dest('./css'))
    .pipe(mincss())
    .pipe(rename('flex-object.min.css'))
    .pipe(gulp.dest('./css'));
});

gulp.task('md', function() {
  var exampleOptions = {
    classes: {
      container: 'mb3 rounded bg-darken-1',
      rendered: 'p2',
      code: 'm0 p2 bg-darken-1'
    }
  };
  var options = {};
  options.renderer = {
    code: markedExample(exampleOptions)
  };
  gulp.src('./README.md')
    .pipe(marked(options))
    .pipe(header( fs.readFileSync('./templates/header.html', 'utf8') ))
    .pipe(footer( fs.readFileSync('./templates/footer.html', 'utf8') ))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', ['css', 'md'], function() {
  gulp.watch(['./index.css', './lib/*.css', './README.md'], ['css', 'md']);
});

gulp.task('default', ['watch']);

