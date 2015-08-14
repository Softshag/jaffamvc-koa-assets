'use strict';

const gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    tsc = require('gulp-typescript'),
    concat = require('gulp-concat');

gulp.task('typescript', function () {

  let result = gulp.src('./src/*.ts')
  .pipe(tsc({
    "target": "ES5",
    "module": "commonjs",
    "isolatedModules": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "declaration": true,
    "noImplicitAny": false,
    "removeComments": false,
    "noLib": false,
    "preserveConstEnums": true,
    "suppressImplicitAnyIndexErrors": true,
    declarationFiles: true
  }));

  /*return result.js.pipe(webpack({
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          blacklist: [],
          loose: "all"
          //loose: ["es6.classes", "es6.properties.computed",'es6.modules']
        }
      }]
    },
    output: {
      library: "Assets",
      libraryTarget: "umd",
      filename: 'client.js'
    }
  }));*/
  return result.js.pipe(gulp.dest('./src/dist'))
  /*return merge(
    result.js.pipe(gulp.dest('./dist/client.js')),
    result.dst.pipe(gulp.dest('./dist/'))
  );*/


});


gulp.task('build', ['typescript'], function () {
  return gulp.src('./src/dist/index.js')
  .pipe(webpack({
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          blacklist: [],
          loose: "all"
          //loose: ["es6.classes", "es6.properties.computed",'es6.modules']
        }
      }]
    },
    output: {
      library: "Assets",
      libraryTarget: "umd",
      filename: 'client.js'
    }
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch',['build'],function () {
  gulp.watch('./src/*.ts', ['build'])
});
