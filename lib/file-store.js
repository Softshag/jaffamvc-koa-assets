'use strict';

let assign = require('object-assign'),
  fs = require('mz/fs'),
  Path = require('path'),
  u = require('jaffamvc-koa').utils,
  co = u.co,
  mkdirp = require('mkdirp'),
  errors = require('./errors'),
  utils = require('./utils'),
  Promise = u.Promise,
  debug = require('debug')('mvc:assets:filestore');


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

  debug('upload path: %s, url root: %s', this.rootURL, this.root);

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
      debug('write file to %s to %s',asset.path,fp);
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
    debug('remove file %s', fp);
    return removeFile(fp);
  },

  /**
   * Return a file stream
   * @param  {String} path string path
   * @return {Promise<Stream>}      A stream
   */
  stream: function(path) {
    return co(function *() {
      if (yield this.has(path)) {
        let fp = full_path.call(this, path);
        debug('stream file: %s',fp);
        return fs.createReadStream(fp);
      }
      return null;
    }.bind(this));
  },

  has: function (path) {
    var fp = full_path.call(this,path);
    debug('check file: %s',fp)
    var self = this
    return fs.exists(fp).then(function (ret) {
      debug('file exists:%s : %s',ret, fp)
      return ret
    }).catch(function (e) {
      console.log(e)
    });
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

function * streamFile (path, done) {
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
