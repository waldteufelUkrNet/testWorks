'use strict';
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ VARIABLES ↓↓↓ */
  const { src,
          dest,
          // task,
          series,
          parallel,
          watch
        } = require('gulp');

  const bs      = require('browser-sync').create(),
        del     = require('del'),
        autopre = require('gulp-autoprefixer'),
        concat  = require('gulp-concat'), // ??? а css?
        csso    = require('gulp-csso'),
        notify  = require('gulp-notify'),
        pug     = require('gulp-pug'),
        scss    = require('gulp-sass')(require('sass')),
        uglify  = require('gulp-uglify-es').default;
/* ↑↑↑ /VARIABLES ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ TASKS (DEVELOPMENT) ↓↓↓ */
  // server for live reload
  function startBrowserSync() {
    bs.init({
      server : {
        baseDir : 'app/client/',
        index: 'workpage.html'
      },
      notify: false // відключення повідомлень browserSync
    });
  }
  module.exports.startBrowserSync = startBrowserSync;

  // workpage: pug -> html
  function convertWorkPage(){
    return src('app/client/workpage.pug')
           .pipe(pug({
             pretty : true
           }))
           .on('error', notify.onError({
             message : 'Error: <%= error.message %>',
             title   : 'PUG error'
           }))
          .pipe( dest('app/client/') );
  }
  module.exports.convertWorkPage = convertWorkPage;

  // pages: pug -> html
  function convertPug(){
    return src('app/client/pages/*.pug')
           .pipe(pug({
             pretty : true
           }))
           .on('error', notify.onError({
             message : 'Error: <%= error.message %>',
             title   : 'PUG error'
           }))
           .pipe( dest('app/client/pages/') );
  }
  module.exports.convertPug = convertPug;

  // scss -> css
  function convertSCSS() {
    return src('app/client/scss/*.scss')
           .pipe( scss({outputStyle: 'expanded'}) ) // nested expanded compact compressed
           .on('error', notify.onError({
              message : 'Error: <%= error.message %>',
              title   : 'SASS error'
            }))
           .pipe (autopre ({overrideBrowserslist: ['last 10 version'], grid: 'autoplace'}) )
           .on('error', notify.onError({
              message : 'Error: <%= error.message %>',
              title   : 'Autoprefixer error'
            }))
           .pipe( dest('app/client/css/') )
           .pipe( bs.stream() );
  }
  module.exports.convertSCSS = convertSCSS;

  // watching & live reload
  function startWatch(){
    watch(['app/client/workpage.pug'], convertWorkPage);
    watch(['app/client/pages/*.pug'], convertPug);
    watch(['app/client/scss/*.scss'], convertSCSS);
    watch(['app/client/pages/*.html', 'app/client/workpage.html']).on('change',  bs.reload);
  }
  module.exports.startWatch = startWatch;

  module.exports.default = series(convertSCSS, convertPug, convertWorkPage, parallel(startBrowserSync, startWatch));
/* ↑↑↑ /TASKS (DEVELOPMENT) ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////
/* ↓↓↓ TASKS (PRODUCTION) ↓↓↓ */
  // function convertServerJS() {
  //   return src(['app/*/*.js', '!app/socket/**/*'])
  //          .pipe( uglify() )
  //          .on('error', notify.onError({
  //             message : 'Error: <%= error.message %>',
  //             title   : 'JS error'
  //           }))
  //          .pipe( dest('dist/') )
  // }
  // exports.convertServerJS = convertServerJS;

  // function convertAppJS() {
  //   return src('app/app.js')
  //          .pipe( uglify() )
  //          .on('error', notify.onError({
  //             message : 'Error: <%= error.message %>',
  //             title   : 'JS error'
  //           }))
  //          .pipe( dest('dist/') )
  // }
  // exports.convertAppJS = convertAppJS;

  // function copyFiles(done) {
  //   src('app/config/config.json').pipe( dest('dist/config/') );
  //   src('app/bin/**/*').pipe( dest('dist/bin/') );
  //   src('app/templates/**/*.pug').pipe( dest('dist/templates/') );
  //   src('app/datastorage/**/*').pipe( dest('dist/datastorage/') );
  //   src('app/socket/**/*').pipe( dest('dist/socket/') );

  //   src('app/public/css/main.css').pipe( csso() ).pipe( dest('dist/public/css/') );
  //   src('app/public/fonts/**/*').pipe( dest('dist/public/fonts/') );
  //   src('app/public/html/**/*').pipe( dest('dist/public/html/') );
  //   src('app/public/*.html').pipe( dest('dist/public/') );
  //   src('app/public/img/**/*').pipe( dest('dist/public/img/') );
  //   src('app/public/js/main.js').pipe( dest('dist/public/js/') );

  //   done()
  // }
  // exports.copyFiles = copyFiles;

  // // чищення каталогу dist
  // function clean(done) {
  //   return del('dist');
  //   done();
  // }
  // exports.clean = clean;

  // exports.build = series(clean, convertServerJS, convertAppJS, copyFiles);
/* ↑↑↑ /TASKS (PRODUCTION) ↑↑↑ */
////////////////////////////////////////////////////////////////////////////////