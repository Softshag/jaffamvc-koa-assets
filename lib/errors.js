'use strict';

var util = require('util');

exports.NotFoundError = function NotFoundError (message) {
  this.message = message;
  this.status = 404
  Error.apply(this, arguments);
};

util.inherits(exports.NotFoundError, Error);
