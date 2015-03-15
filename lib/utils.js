
'use strict';

let mkdirp = require('mkdirp'),
    Promise = require('native-or-bluebird');

exports.mkdirp = function(p) {
  return new Promise(function(resolve, reject) {
    mkdirp(p, function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
};
