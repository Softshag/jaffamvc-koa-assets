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
      let stream;
      try {
        stream = yield assets.stream(file);
      } catch (e) {
        this.throw(404);
      }

      this.body = stream;
    };
  },

  list: function (assets, options) {




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

      yield assets.remove(file);

      this.body = "ok";
    };
  }
}