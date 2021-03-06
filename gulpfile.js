var gulp = require('gulp');
var coffee = require('gulp-coffee');
var coffeelint = require('gulp-coffeelint');
var header = require('gulp-header');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var lessAutoPrefix = require('less-plugin-autoprefix');
var lessCleanCss = require('less-plugin-clean-css');
var browserSync = require('browser-sync').create();

var isMin = false;

var creditText = [
  '/* Develope by : Kosate Limpongsa',
  ' * https://github.com/kosate/portfolio',
  ' */'
].join('\n') + "\n";


gulp.task('js',function() {
  var tmp =
  gulp.src(['./src/private/*.coffee'])
    .pipe(coffeelint({
      "no_backticks": {
        "level": "ignore"
      }
    }))
    .pipe(coffeelint.reporter())
    .pipe(coffee())
    .on('error',function(){});
  if( isMin )
    tmp.pipe(uglify());
  tmp
    .pipe(header(creditText))
    .pipe(gulp.dest('./src/public/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('css',function() {
  var tmp = gulp.src(['./src/private/*.less'])
    .pipe(less())
    .on('error',function( err ){ console.log(err); });
  if( isMin )
    tmp
      .pipe(minifyCss())
      .pipe(header(creditText));
  else
    tmp.pipe(header(creditText));
  tmp.pipe(gulp.dest('./src/public/'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('build',function() {
  isMin = true;
  gulp.start( 'js','css' );
});

gulp.task('default',['js','css']);

gulp.task('watch',function() {

  browserSync.init({
    server : {
      baseDir : "./"
    }
  })

  gulp.watch(["*","portfolio/*"]).on('change',browserSync.reload);
  gulp.watch(['./src/private/*.coffee'],['js']);
  gulp.watch(['./src/private/*.less'],['css']);
});
