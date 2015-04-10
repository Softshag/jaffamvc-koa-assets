'use strict';

let assign = require('object-assign'),
    knox = require('knox'),
    Promise = require('native-or-bluebird');

module.exports = S3Store;

function S3Store(options) {

  this.client = knox.createClient(options);
  this.prefix = options.prefix || "";
  this.maxAge = options.maxAge || 0;
}


assign(S3Store.prototype, {
  create: function(fileStream, asset, options) {
    options = options || {};
    let headers = {
      'Content-Length': asset.size,
      'Content-Type': asset.mime,
      'Cache-Control': 'max-age=' + this.ageMax,
      'x-amz-acl': 'public-read'
    };

    assign(headers, options);

    let self = this;
    return new Promise(function (resolve, reject) {

      self.client.putStream(fileStream, asset.path, headers, function (err, res) {
       
        if (err) return reject(err);

        resolve(res.req.url);
      });
    });


  },
  remove: function(path) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.client.deleteFile(path, function (err, res) {
        if (err) return reject(err);
        resolve();
      });
    });
  },
  stream: function(path) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.client.getFile(path, function (err,res) {

        if (err) return reject(err);
        resolve(res);
      });
    });

  },
  has: function (path) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.client.headFile(path, function (err, res) {
        if (err) return reject(err);
        resolve(res.statusCode === 200);
      })
    });
  }
});



function buildHeader () {

}
