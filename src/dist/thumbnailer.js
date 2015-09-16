var request_1 = require('./request');
exports.MimeList = {
    'audio/mpeg': 'audio-generic',
    'audio/ogg': 'audio-generic',
    'application/pdf': 'application-pdf',
    'video/ogg': 'video-generic',
    'video/mp4': 'video-generic',
    'video/x-m4v': 'video-generic',
    'video/quicktime': 'video-generic'
};
var Thumbnailer = (function () {
    function Thumbnailer() {
    }
    Thumbnailer.request = function (asset) {
        return request_1.request.get('/files/' + asset.get('path')).end({
            thumbnail: true,
            base64: false
        }).then(function () {
            console.log(arguments);
            return "";
        });
    };
    Thumbnailer.has = function (asset) {
        return request_1.request.get('/files/' + asset.get('path')).end({
            thumbnail: true,
            check: true
        }).then(function (msg) {
            return "/files/" + asset.get('path') + "?thumbnail=true";
        }).catch(function () {
            return null;
        });
    };
    return Thumbnailer;
})();
exports.Thumbnailer = Thumbnailer;
