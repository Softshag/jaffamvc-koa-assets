'use strict';

var assign = require('object-assign'),
    Path = require('path'),
    fs = require('fs'),
    utils = require('jaffamvc-koa').utils;

module.exports = MetaStore;


function MetaStore (options) {
  this.root = options.root;



  if (!this.root) {
    throw new Error('needs root parameter');
  }

  this.config_file =  options.config || '_config.json';

  var self = this;
  read.call(this).then(function (files) {
    self.files = files;
  });

}

assign(MetaStore.prototype, {
  create: function (asset) {

    this.files.push(asset);
    return write.call(this, this.files);

  },
  remove: function (path) {

    var i, asset;
    for (i=0;i<this.files.length;i++) {
      asset = this.files[i];
      if (asset.path === path) {
        break;
      }
    }
    this.files.splice(i, 1);

    return write.call(this, this.files);

  },

  list: function () {
    return this.files;
  },
  find: function (path) {
    var i, asset;
    for(i=0;i<this.files.length;i++) {
      asset = this.files[i];
      if (asset.path === path) utils.Promise.resolve(asset);
    }
    return utils.Promise.resolve(null);
  },
  clear: function () {
    try {
      fs.unlinkSync(Path.join(this.root, this.config_file));
    } catch (e) {}

    let self = this;
    return read.call(this).then(function (files) {
      self.files = files;
    });
  }
});


function read () {
  let file = Path.join(this.root, this.config_file), data;
  let defer = utils.deferred();

  let promise = defer.promise.then(function (result) {
    return JSON.parse(data);
  });

  fs.readFile(file, 'utf8', defer.done);

  return promise;
}

function write (data) {
  let file = Path.join(this.root, this.config_file);
  let defer = utils.deferred();

  data = JSON.stringify(data)

  fs.writeFile(file, data, 'utf8', defer.done);

  return promise;

}
