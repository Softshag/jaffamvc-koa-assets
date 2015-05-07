'use strict';

debug = require('debug')('mvc:assets:routes')

module.exports = {
  upload: function (assets) {

    return function *() {
      if (!this.request.is('multipart/*')) {
        this.throw(400);
      }

      let parts = this.request.parts();

      let files = [], opts = {}, part;
      while(part = yield parts) {
        if (part.length) {
          opts[part[0]] = part[1];
        } else {
          files.push(part);
        }
      }

      if (files.length) {
        files = files[0];
        let ret;
        try {
          ret = yield assets.create(files, files.filename, opts);
        } catch (e) {
          this.logger.error('could not upload file: ', e.message);
          this.throw(400, e);
        }
        this.body = ret;
      } else {
        this.throw(400);
      }
    };

  },

  stream: function (assets, options) {

    let keyParam = options.keyParam || 'file';

    return function *() {
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

      this.type = asset.mime;
      let stream = yield assets.stream(file);
      this.body = stream;
    };
  },

  remove: function () {

    return function *() {
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

      assets.remove(file);
    };
  }
}