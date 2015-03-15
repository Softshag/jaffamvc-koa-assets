'use strict';

var assign = require('object-assign'),
    Path = require('path'),
    fs = require('fs');

module.exports = MetaStore;


function MetaStore (options) {
  this.root = options.root;



  if (!this.root) {
    throw new Error('needs root parameter');
  }

  this.config_file =  options.config || '_config.json';

  this.files = read.call(this);

}

assign(MetaStore.prototype, {
  create: function (asset) {

    this.files.push(asset);
    write.call(this, this.files);

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

    write.call(this, this.files);

  },

  list: function () {
    return this.files;
  },
  find: function (path) {
    var i, asset;
    for(i=0;i<this.files.length;i++) {
      asset = this.files[i];
      if (asset.path === path) return asset;
    }
  },
  clear: function () {
    try {
      fs.unlinkSync(Path.join(this.root, this.config_file));
    } catch (e) {}

    this.files = read.call(this);
  }
});


function read () {
  let file = Path.join(this.root, this.config_file), data;

  try {
    data = fs.readFileSync(file, 'utf8');
    data = JSON.parse(data);
  } catch (e) {
    data = [];
  }

  return data;
}

function write (data) {
  let file = Path.join(this.root, this.config_file);

  data = JSON.stringify(data);
  try {
    fs.writeFileSync(file, data, 'utf8');
  } catch (e) { }

}
