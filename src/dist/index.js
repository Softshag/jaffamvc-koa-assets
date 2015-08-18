function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var views_1 = require('views');
require('./preview-handlers');
views_1.EventEmitter.debugCallback = function (name, _, event, args) {
    //console.log(arguments)
};
__export(require('./fileuploader'));
__export(require('./filebutton'));
__export(require('./assets-collection'));
__export(require('./assets-list'));
__export(require('./assets-preview'));
__export(require('./gallery'));
