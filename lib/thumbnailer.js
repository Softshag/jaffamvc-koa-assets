'use strict';

let assign = require('object-assign'),
    utils = require('jaffamvc-koa').utils,
    co = utils.co,
    crypto = require('mz/crypto'),
    Path = require('path');

function randomName(name, len) {
  return co(function *() {
    len = len||32;
    let rnd = yield crypto.randomBytes(len);
    let rndString = crypto.createHash('sha1').update(rnd.toString()).digest('hex');
    if (name) {
      rndString += Path.extname(name);
    }
    return rndString;
  });
}

var Generators = {};

function Thumbnailer (assets, options) {
  this.assets = assets
}
module.exports = Thumbnailer;

Thumbnailer.setGenerator = function (mime, generator) {
  if (!Array.isArray(mime)) mime = [mime];
  mime.forEach(function (m) {
    Generators[m] = generator;
  });
};

assign(Thumbnailer.prototype, {
  request (asset, options) {
    var self = this;
    return co(function *() {
      let generator = Generators[asset.mime];
      if (!generator) {
        throw new Error('generator not found for ' + asset.mime);
      }

      if (!self.assets.has(asset.path)) {
        throw new Error('asset not found in store: ' + asset.path)
      }

      let stream = yield self.assets.stream(asset.path);

      return yield generator(stream);
    });

  },
  canThumbnail (mime) {
    return !!Generators[mime];
  }
});

const gm = require('gm'),
  childp = require('mz/child_process'),
  fs = require('mz/fs'),
  pipe = require('pipe');

Thumbnailer.setGenerator(['image/png','image/jpeg'], function * (stream, options) {
  return gm(stream).resize(100, 100).stream();
});

Thumbnailer.setGenerator('application/pdf',function *(stream, options) {
  let tmp_pdf = yield randomName('file.pdf', 20)
  let tmp_pdf_full = process.cwd() + '/tmp/' + tmp_pdf
  let tmp_png = process.cwd() + '/tmp/' + (yield randomName('file.png', 20))

  yield pipe.stream(stream).toDest(fs.createWriteStream(tmp_pdf_full));
  yield childp.exec("convert '" + tmp_pdf_full + "[0]' " + tmp_png);

  fs.unlink(tmp_pdf_full);

  /*let s = pipe.stream(fs.createReadStream(tmp_png))
  s.on('finish', function () {
    console.log('did finish');
    fs.unlink(tmp_png);
  });*/

  return gm(tmp_png).resize(200, 200).stream().on('end', function () {
    fs.unlink(tmp_png);
  });

});
const ffmpeg = require('fluent-ffmpeg');

Thumbnailer.setGenerator(['video/x-m4v', 'video/quicktime'],function *(stream, options) {
  let tmp_pdf = 'file.mp4'
  let tmp_pdf_full = process.cwd() + '/tmp/' + tmp_pdf
  let tmp_png = process.cwd() + '/tmp/file.png'

  yield pipe.stream(stream).toDest(fs.createWriteStream(tmp_pdf_full));

  yield childp.exec('ffmpeg -i ' + tmp_pdf_full + ' -y -vframes 1 ' + tmp_png)

  return gm(tmp_png).resize(200, 200).stream().on('end', function () {
    fs.unlink(tmp_png)
  });
});
