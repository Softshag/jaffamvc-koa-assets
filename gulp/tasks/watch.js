'use strict';

const gulp = require('gulp');



gulp.task('watch', ['build','watch:javascript', 'watch:stylus']);

