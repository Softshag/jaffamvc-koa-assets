'use strict';

const gutil = require('gulp-util'),
  assign = require('object-assign');

assign(exports, {
  errorHandler: function (title) {
    return function (err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  },
  src: 'src',
  tmp: '.tmp',
  dist: 'public',
  wiredep: {
    directory: 'bower_components'
  }
});