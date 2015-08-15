'use strict';

const gulp = require('gulp');



gulp.task('build', ['build:typescript', 'build:javascript', 'build:stylus']);