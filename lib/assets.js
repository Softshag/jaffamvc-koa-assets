'use strict';

let assign = require('object-assign'),
    os = require('os'),
    Path = require ('path'),
    crypto = require('mz/crypto'),
    co = require('co'),
    Mime = require('mime'),
    fs = require('mz/fs');

module.exports = Assets;

const tmpDir = os.tmpDir() || os.tmpdir();

// internal method write file
var writeFile = function (stream, path) {
  return new Promise(function (resolve, reject) {
    var ws = fs.createWriteStream(path);
    ws.on('finish', resolve)
    .on('error', reject);

    stream.pipe(ws);
  });
};

/**
 * Assets
 * @param {Object} options
 * @constructor Assets
 */
function Assets (options) {
  this.store = options.store;
  this.meta = options.meta;
  this._handlers = {};
}

assign(Assets.prototype, {

  /**
   * Create file
   * @param  {Stream} stream A file stream
   * @param  {String} path   Destination path
   * @return {Promise<Asset>}
   * @memberOf  Assets#
   */
  create: function (stream, path, options) {

    var self = this;

    return co(function *() {
      var stats, url, mime;

      var rnd = yield crypto.randomBytes(24),
          ext = Path.extname(path),
          tmp = Path.join(tmpDir, rnd.toString('hex') + ext);

      // Write temp file, so that we can inspect the file.
      yield writeFile(stream, tmp);

      // Get size and mime type.
      stats = yield fs.stat(tmp);
      mime = Mime.lookup(tmp);

      var asset = {
        path: path.replace(/\s+/mig, '_'),
        mime: mime,
        size: stats.size
      };

      var ws = fs.createReadStream(tmp);
      asset.url = yield self.store.create(ws, asset, options);

      var handler = self.getHandler.call(self,mime);

      if (handler) {
        asset = yield handler(asset, tmp);
      }

      yield fs.unlink(tmp);

      if (self.metaStore) {
        asset = yield self.metaStore.create(asset);
      }

      return asset;
    });

  },
  /**
   * Remove a file
   * @param  {String} path The path of the file
   * @return {Promise}
   */
  remove: function (path) {
    if (typeof path !== 'string') {
      path = path.path;
    }

    return this.store.remove(path);
  },

  /**
   * Get list of the files in the store
   * @param  {String|Object} path a string or a object with `path` property
   * @return {Array<Object>}
   */
  list: function () {
    return this.store.list();
  },
  /**
   * Get a stream of a file
   * @param  {String|Object} path the path to the file or a object with a `path` property
   * @return {Stream}
   */
  stream: function (path) {
    return this.store.stream(path);
  },
  /**
   * Set a handler function for a specific mime type
   * @param {String} mime
   * @param {Function} handler Function(asset, path-to-tmpfile)
   */
  setHandler: function(mime, handler) {
    if (typeof handler !== 'function') {
      throw new Error('Handler is not a function');
    }
    this._handlers[mime] = handler;
  },

  has: function (path) {
    return this.store.has(path);
  },
  /**
   * Get a handler for a mime type
   * @param  {String} mime mime type
   * @return {Function}
   */
  getHandler: function (mime) {

    for (var key in this._handlers) {
      var reg = new RegExp(key, 'i');
      if (reg.test(mime))
        return this._handlers[key];
    }
  }
});
