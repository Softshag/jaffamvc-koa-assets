var request_1 = require('./request');
var Thumbnailer = (function () {
    function Thumbnailer() {
    }
    Thumbnailer.request = function (asset) {
        console.log('request');
        return request_1.request.get('/files/' + asset.get('path')).end({
            thumbnail: true,
            base64: true
        });
    };
    return Thumbnailer;
})();
exports.Thumbnailer = Thumbnailer;
