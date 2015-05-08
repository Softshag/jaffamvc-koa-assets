'use strict';

let assign = require('object-assign'),
    knox = require('knox'),
    jaffamvc = require('jaffamvc-koa'),
    utils = jaffamvc.utils,
    debug = require('debug')('mvc:assets:s3store');

module.exports = S3Store;

function S3Store(options) {

  this.client = knox.createClient(options);
  this.prefix = options.prefix || "";
  this.maxAge = options.maxAge || 0;

  this.rootURL = this.client.urlBase;
}


assign(S3Store.prototype, {
  create: function(fileStream, asset, options) {
    options = options || {};
    let headers = {
      'Content-Length': asset.size,
      'Content-Type': asset.mime,
      'Cache-Control': 'max-age=' + (options.maxAge||this.ageMax),
      'x-amz-acl': options.acl || 'public-read'
    };

    assign(headers, options);

    let self = this;
    return new utils.Promise(function (resolve, reject) {

      self.client.putStream(fileStream, asset.path, headers, function (err, res) {

        if (err) return reject(err);
        debug('upload %s to %s', asset.path, res.req.url);
        resolve(res.req.url);
      });
    });


  },
  remove: function(path) {
    var self = this;
    return new utils.Promise(function (resolve, reject) {
      self.client.deleteFile(path, function (err, res) {
        if (err) return reject(err);
        debug('remove file %s', path);
        resolve();
      });
    });
  },
  stream: function(path) {
    var self = this;
    return new utils.Promise(function (resolve, reject) {
      self.client.getFile(path, function (err,res) {

        if (err) return reject(err);
        resolve(res);
      });
    });

  },
  has: function (path) {
    let self = this;
    return new utils.Promise(function (resolve, reject) {
      self.client.headFile(path, function (err, res) {
        if (err) return reject(err);
        resolve(res.statusCode === 200);
      });
    });
  }
});



function buildHeader () {

}
