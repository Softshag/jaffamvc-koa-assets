'use strict';

let assign = require('object-assign'),
    utils = require('jaffamvc-koa').utils,
    co = utils.co,
    crypto = require('mz/crypto'),
    Path = require('path');



var Generators = {};

function Thumbnailer (assets, options) {
  this.assets = assets
  
  assets.on('remove', this._onAssetRemove, this)
  
}
module.exports = Thumbnailer;

Thumbnailer.setGenerator = function (mime, generator) {
  if (!Array.isArray(mime)) mime = [mime];
  mime.forEach(function (m) {
    Generators[m] = generator;
  });
};

Thumbnailer.thumbName = thumbName

assign(Thumbnailer.prototype, {
  request (asset, options) {
    var self = this;
    return co(function *() {
      let generator = Generators[asset.mime];
      if (!generator) {
        throw new Error('generator not found for ' + asset.mime);
      }
      
      let tn = thumbName(asset.path)
      
      if ((yield self.assets.has(tn))) {
        
        return yield self.assets.stream(tn)
      }

      if (!(yield self.assets.has(asset.path))) {
        throw new Error('asset not found in store: ' + asset.path)
      }

      let stream = yield self.assets.stream(asset.path);
      
      stream = yield generator(stream)
      
      
      
      self.assets.create(stream, tn, {skipMeta:true}).catch(function (e) {
        console.log(e.stack)
      })
      return stream
      
    });

  },
  canThumbnail (mime) {
    return !!Generators[mime];
  },
  
  _onAssetRemove (path) {
    co(function *() {
    
      let tn = thumbName(path)  
      if ((yield this.assets.has(tn))) {
        yield this.assets.remove(tn, {skipMeta:true});
      }
      
    });
  }
});



function thumbName (path) {
  let ext = Path.extname(path), basename = Path.basename(path, ext),
        dir = Path.dirname(path)
  dir = dir == '.' ? '' : dir
  let thumbnail = dir + basename + '.thumbnail.png'
  
  return thumbnail
}


