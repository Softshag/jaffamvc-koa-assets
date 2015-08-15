'use strict';

const gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    tsc = require('gulp-typescript'),
		merge = require('merge2');
		
gulp.task('build:typescript', function () {

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
	
	return merge([
		result.js.pipe(gulp.dest('./src/dist')),
		result.dts.pipe(gulp.dest('./src/dist'))
	]);
 

});


gulp.task('build:javascript', ['build:typescript'], function () {
  return gulp.src('./src/dist/index.js')
  .pipe(webpack({
    output: {
      library: "Assets",
      libraryTarget: "umd",
      filename: 'client.js'
    },
    externals: {
    	//views: 'views'
    }
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch:javascript', function () {
  gulp.watch('./src/*.ts', ['build:javascript'])
});
