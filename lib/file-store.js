'use strict';

let assign = require('object-assign'),
  fs = require('mz/fs'),
  Path = require('path'),
  co = require('co'),
  mkdirp = require('mkdirp'),
  errors = require('./errors'),
  utils = require('./utils'),
  Promise = require('native-or-bluebird');

module.exports = FileStore;

/**
 * Filestore
 * @constructs FileStore
 * @param {Object} options
 */
function FileStore(options) {

  let u = this.rootURL = options.rootURL;
  if (u.substr(u.length - 2, 1) != '/') {
    this.rootURL = u + '/';
  }

  this.root = options.root;

  if (!this.rootURL || !this.root) {
    throw new Error('needs both root and rootURL parameters');
  }

}


assign(FileStore.prototype, {
  /**
   * Create file
   * @param  {ReadableStream} fileStream a readable stream
   * @param  {Object} asset      an asset object
   * @return {Promise<String>}
   */
  create: function(fileStream, asset) {
    let path = asset.path, fp = full_path.call(this, path), self = this;

    return writeFile(fp, fileStream).then(function() {
      if (path.substr(0, 1) === '/') {
        path = path.substr(1);
      }
      return self.rootURL + path;
    });
  },

  /**
   * Remove file
   * @param  {String} path
   * @return {Promise}
   */
  remove: function(path) {
    var fp = full_path.call(this, path);
    return removeFile(fp);
  },

  /**
   * Return a file stream
   * @param  {String} path string path
   * @return {Promise<Stream>}      A stream
   */
  stream: function(path) {

    var self = this;
    return new Promise(function (resolve, reject) {

      var fp = full_path.call(self, path);
      streamFile(fp, function (err, result) {
        if (err) return reject(err);
        resolve(result);
      });

    });
  },

  has: function (path) {
    var fp = full_path.call(this,path);
    return fs.exists(fp);
  }
});


function full_path(path) {
  return Path.join(this.root, path);
}

function writeFile(path, stream) {
  var bn = Path.dirname(path);
  return co(function * () {

    var ret = yield fs.exists(bn);

    if (!ret) {
      yield utils.mkdirp(bn);
    }

    yield new Promise(function(resolve, reject) {
      var p = fs.createWriteStream(path);

      p.once('finish', resolve);
      p.once('error', reject);

      stream.pipe(p);

    });
  });
}

function removeFile(path) {
  return co(function * () {
    try {
      yield fs.unlink(path);
    } catch (e) {
      if (e.code && e.code === 'ENOENT') {
        throw new errors.NotFoundError(e.message);
      } else {
        throw e;
      }
    }

  });
}

function streamFile(path, done) {
  var result, err = null;
  try {

    result = fs.createReadStream(path);
  } catch (e) {
    err = e;
    if (e.code && e.code === 'ENOENT') {
      err = new errors.NotFoundError(e.message);
    }
  }
  done(err, result);
}
