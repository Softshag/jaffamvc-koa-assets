'use strict';

let JaffaMVC = require('jaffamvc-koa');


let app = new JaffaMVC();

app.phase('assets', require('../lib')({
  rootURL: 'http://localhost:3000/files',
  root: process.cwd() + '/uploads'
}));

app.phase('stack', require('jaffamvc-koa-stack')({
  views: {
    path: './views'
  }
}));

function setup(app) {
  app.router.post('/files', app.assets.routes.upload());
  app.router.get('/files', app.assets.routes.list())
  app.router.get('/assets.js', app.assets.routes.client());
  app.router.get('/', function *(next) {
    this.body = yield this.render('index.jade')
  })
}

app.start().then(function () {
  setup(app);
  let port = process.env.PORT||3000;
  app.listen(port);
  app.logger.info('application started and listening on port ' + port);
}).catch(function (e) {
  app.logger.error(e.stack);
});
