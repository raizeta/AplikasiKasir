var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var concatCss = require('gulp-concat-css');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass','css-minify','templatecache','js-annotate']);

// Customize Radumta Sitepu
// gulp.task('serve:before', ['watch']);

gulp.task('sass', function(done) 
{
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({keepSpecialComments: 0}))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('css-minify', function (done) 
{
    gulp.src(['!./www/css/ionic.app.css','!./www/css/ionic.app.min.css','./www/css/*.css']) 
    .pipe(concatCss("styles.css"))
    .pipe(gulp.dest('./www/build/concat'))
    .pipe(minifyCss()) 
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/build/minify')) 
    .on('end', done);
});

gulp.task('watch', ['sass'], function() 
{
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() 
{
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) 
{
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('templatecache', function(done)
{
    gulp.src('./www/templates/**/*.html')
    .pipe(templateCache({standalone:true}))
    .pipe(gulp.dest('./www/build/concat'))
    .on('end', done);
});



gulp.task('js-annotate', function (done) 
{
  gulp.src('./www/js/**/*.js')
  .pipe(ngAnnotate({single_quotes: true}))
  .pipe(gulp.dest('./www/build/annotate'))
  .on('end', done);
});









