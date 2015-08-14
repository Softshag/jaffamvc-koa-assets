'use strict';

var jaffamvc = require('jaffamvc-koa'),
  MetaStore = require('./meta-store'),
  Assets = require('./assets'),
  debug = require('debug')('mvc:assets'),
  compose = require('koa-compose'),
  routes = require('./routes');

module.exports = function(opt) {

  return function () {

    var Store = opt.store || 'filesystem';
    var Meta = opt.meta || MetaStore;

    if (typeof Store === 'string') {

      if (Store === 's3') {
        Store = require('./s3-store');
      } else if (Store === 'filesystem') {
        Store = require('./file-store');
      }
      opt.store = new Store(opt);
    }

    opt.meta = new Meta(opt);
    opt.app = this;

    debug('using store: %s', Store.name);

    this.assets = new Assets(opt);

    let assets = this.assets;

    this.assets.routes = {
      upload: function (options) {
        return routes.upload(assets, options);
      },
      stream: function (options) {
        return routes.stream(assets, options);
      },
      remove: function (options) {
        return routes.remove(assets, options);
      },
      list: function (options) {
        return routes.list(assets, options);
      },
      get: function (options) {
        return routes.get(assets, options);
      },
      client: function (options) {
        return routes.client(assets, options);
      }
    };

    this.context.assets = this.assets;

  };
};
