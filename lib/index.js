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
    }

    debug('using store: %s', Store.name);

    this.assets = new Assets({
      store: new Store(opt),
      meta: new Meta(opt)
    });

    this.assets.routes = {
      upload: function (options) {
        return routes.upload(this.assets, options);
      },
      stream: function (options) {
        return routes.stream(this.assets, options);
      },
      remove: function (options) {
        return routes.remove(this.assets, options);
      }
    };

    this.context.assets = this.assets;

  };
};
