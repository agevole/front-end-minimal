var del = require('del');
var gulp = require('gulp');
var rev = require('gulp-rev');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var stylish = require('jshint-stylish');
var usemin = require('gulp-usemin');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var DEST = 'build/';

gulp.task('clean', function() {
  del(['src/css/ui.css', DEST], function (err, files) {
    files.forEach(function(file) {
      console.log('Deleted:', file);
    });
  });
});

gulp.task('jshint', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*.{png,jpg,jpeg,gif}')
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(DEST + 'images/'));
});

gulp.task('styles', function() {
  return gulp.src('src/styles/ui.styl')
    .pipe(stylus())
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(gulp.dest('src/css/'));
});

gulp.task('usemin', ['styles'], function() {
  return gulp.src('src/index.html')
    .pipe(usemin({
      js: [uglify(), rev()],
      css: [minifyCSS(), rev()]
    }))
    .pipe(gulp.dest(DEST));
});

gulp.task('test', function(done) {
  karma.start({
      singleRun: false,
      configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('test:ci', ['clean', 'jshint'], function(done) {
  karma.start({
      singleRun: true,
      configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('build', ['clean','jshint', 'images', 'usemin']);

gulp.task('dev', ['clean', 'jshint', 'styles'], function() {
  var log = function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  };

  gulp.watch('src/scripts/**/*.js', ['jshint']).on('change', log);
  gulp.watch('src/styles/**/*.styl', ['styles']).on('change', log);
});
