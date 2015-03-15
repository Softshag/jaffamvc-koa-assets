# jaffamvc-koa-assets
JaffaMVC Assets

## Example

```javascript
var assets = require('jaffamvc-koa-assets');
var app = new JaffaMVC();

app.phase('assets', assets({
  store: 'filesystem',
  root: './uploads',
  rootURL: 'http://localhost:3000/file'
}));

var stream = fs.createWriteStream('file.txt');

app.assets.create(stream, 'test1.txt')
.then(function (file) {
  console.log(file);
});

app.router.get(function *() {
  if (yield this.assets.has('test1.txt')) {
    this.body = yield this.assets.stream('test1.txt');
  } else {
    this.throw(404);
  }
});

```
