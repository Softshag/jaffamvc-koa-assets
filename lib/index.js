'use strict';

var jaffamvc = require('jaffamvc-koa'),
  MetaStore = require('./meta-store'),
  Assets = require('./assets'),
  debug = require('debug')('mvc:assets');

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

    this.context.assets = this.assets;

  };
};
