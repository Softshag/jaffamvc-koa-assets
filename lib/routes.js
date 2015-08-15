'use strict';
const koaSend = require('koa-send');
const nodePath = require('path');
const base64 = require('base64-stream');

module.exports = {
  upload: function (assets, options) {

    options = options||{};


    return function * () {
      if (!this.request.is('multipart/*')) {
        this.throw(400);
      }

      let parts = this.request.parts({
        autoFields: true
      });

      let file, part, filename;

      while (part = yield parts) {
        try {
          filename = part.filename;

          if (options.nameFn) {
            filename = options.nameFn.call(this, filename);
          }

          let opts = parts.field;

          if (options.onCreate) {
            opts.onCreate = options.onCreate.bind(this);
          }

          file = yield assets.create(part, filename, opts);
        } catch (e) {
          this.logger.error('could not upload file: ', e.message);
          this.throw(400, e);
        }
        break;
      }
      this.status = 201;
      this.body = file;
    };

  },

  stream: function (assets, options) {

    let keyParam = options.keyParam || 'file';

    return function * () {
      let file;
      if (this.query[keyParam]) {
        file = this.query[keyParam];
      } else if (this.params[keyParam]) {
        file = this.params[keyParam];
      }

      let thumbnail = this.query.thumbnail == 'true' ? true : false;
      let b64 = this.query.base64;

      let download = this.query.download == 'true' ? true : false;

      let asset = yield assets.get(file);

      if (asset == null) {
        this.throw(404);
      }

      if (download) {
          this.attachment(asset.name)
      }

      let stream;

      if (thumbnail) {
        try {
          stream = yield assets.thumbnailer.request(asset);
        } catch (e) {
          this.throw(404, e)
        }
      } else {
        try {
          stream = yield assets.stream(asset.path);
        } catch (e) {
          this.throw(404, e);
        }
      }

      this.type =  thumbnail ? 'image/png' : asset.mime;


      this.body = b64 ? stream.pipe(base64.encode()) : stream;
    };
  },

  list: function (assets, options) {
    options = options||{};



    return function *() {
      this.type = 'application/json';

      let opts = {
        query: this.query,
        params: this.params
      };

      if (options.onList) {
        opts.onList = options.onList.bind(this);
      }

      this.body = yield assets.list(opts);

    };
  },

  get: function (assets, options) {

    let keyParam = options.keyParam || 'file';


    return function *() {

      if (this.query[keyParam]) {
        file = this.query[keyParam];
      } else if (this.params[keyParam]) {
        file = this.params[keyParam];
      }


      this.type = 'application/json';

      let asset = yield assets.get(file);

      if (asset) {
        this.throw(404, new Error('asset not found'))
      }

      this.body = asset;
    };

  },

  remove: function (assets, options) {

    let keyParam = options.keyParam || 'file';


    return function * () {
      let file;
      if (this.query[keyParam]) {
        file = this.query[keyParam];
      } else if (this.params[keyParam]) {
        file = this.params[keyParam];
      }

      let asset = yield assets.get(file);

      if (asset == null) {
        this.throw(404);
      }

      yield assets.remove(asset.path);

      this.body = "ok";
    };
  },

  client: function () {
    let path = nodePath.resolve(__dirname, '..', 'dist','client.js');
    return function *() {
      return yield koaSend(this, path);
    };
  },
  client_css: function () {
    let path = nodePath.resolve(__dirname, '..', 'dist','client.css');
    return function *() {
      return yield koaSend(this, path);
    };
  },
  client_mime: function () {
    let path = nodePath.resolve(__dirname, '..', 'dist','spritesheet.png');
    return function *() {
      return yield koaSend(this, path);
    };
  }
};
