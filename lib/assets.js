'use strict';

let assign = require('object-assign'),
    os = require('os'),
    Path = require ('path'),
    crypto = require('mz/crypto'),
    utils = require('jaffamvc-koa').utils,
    co = utils.co,
    Mime = require('mime'),
    fs = require('mz/fs');

module.exports = Assets;

const tmpDir = os.tmpDir() || os.tmpdir();

// internal method write file
var writeFile = function (stream, path) {
  return new utils.Promise(function (resolve, reject) {
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

  this.onCreate = options.onCreate;
}

assign(Assets.prototype, {

  randomName: function (name, len) {
    return co(function *() {
      len = len||32;
      let rnd = yield crypto.randomBytes(len);
      let rndString = crypto.createHash('sha1').update(rnd.toString()).digest('hex');
      if (name) {
        rndString += Path.extname(name);
      }
      return rndString;
    });
  },
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

      var rnd = yield self.randomName(path),
          tmp = Path.join(tmpDir, rnd);

      // Write temp file, so that we can inspect the file.
      yield writeFile(stream, tmp);

      // Get size and mime type.
      stats = yield fs.stat(tmp);
      mime = Mime.lookup(tmp);

      var asset = {
        name: Path.basename(path),
        path: path.replace(/\s+/mig, '_'),
        mime: mime,
        size: stats.size
      };

      var callFn = function *(fn, asset, tmp) {
        if (utils.isYieldable(fn)) {
          yield fn(asset, tmp);
        } else {
          fn(asset);
        }
      }

      if (self.onCreate) {
        yield callFn(self.onCreate, asset, tmp);
      }

      if (options.onCreate) {
        yield callFn(options.onCreate, asset, tmp);
      }

      var ws = fs.createReadStream(tmp);
      asset.url = yield self.store.create(ws, asset, options);

      var handler = self.getHandler.call(self,mime);

      if (handler) {
        asset = yield handler(asset, tmp);
      }

      yield fs.unlink(tmp);

      if (self.meta) {
        asset = yield self.meta.create(asset, options);
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
    return co(function *() {
      if (typeof path !== 'string') {
        path = path.path;
      }

      if (this.meta) {
        yield this.meta.remove(path);
      }

      return yield this.store.remove(path);
    }.bind(this))

  },

  /**
   * Get list of the files in the store
   * @param  {String|Object} path a string or a object with `path` property
   * @return {Array<Object>}
   */
  list: function (options) {
    return co(function *() {

      if (this.meta) {
        return yield this.meta.list(options);
      }

      return yield this.store.list(options);
    }.bind(this));

  },
  /**
   * Get a stream of a file
   * @param  {String|Object} path the path to the file or a object with a `path` property
   * @return {Stream}
   */
  stream: function (path) {
    return this.store.stream(path);
  },

  get: function (path) {
    if (this.meta) {
      return this.meta.find(path);
    }
    return utils.Promise.resolve(null);
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
