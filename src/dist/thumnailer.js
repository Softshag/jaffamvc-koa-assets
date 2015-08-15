var request_1 = require('./request');
var Thumbnailer = (function () {
    function Thumbnailer() {
    }
    Thumbnailer.prototype.request = function (mime) {
        return request_1.request.get('/file/thumnail').end();
    };
    return Thumbnailer;
})();
exports.Thumbnailer = Thumbnailer;
