'use strict';

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
            filename = options.nameFn.call(this,filename);
          }


          file = yield assets.create(part, filename, parts.field);
        } catch (e) {
          this.logger.error('could not upload file: ', e.message);
          this.throw(400, e);
        }
        break;
      }

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

      assets.remove(file);
    };
  }
}