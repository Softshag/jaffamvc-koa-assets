
'use strict';

let mkdirp = require('mkdirp'),
    Promise = require('jaffamvc-koa').utils.Promise,
    co = require('co'),
    crypto = require('mz/crypto'),
    Path = require('path');

exports.mkdirp = function(p) {
  return new Promise(function(resolve, reject) {
    mkdirp(p, function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
};

exports.randomName = function (name, len, hash) {
  return co(function *() {
      len = len||32;
      let rnd = yield crypto.randomBytes(len),
        rndString = null;
      
      rndString = rnd.toString()
      
      if (hash) {
        rndString = crypto.createHash(hash).update(rndString).digest('hex');  
      } 
      
      if (name) {
        rndString += Path.extname(name);
      }
      
      return rndString;
    
    });
};