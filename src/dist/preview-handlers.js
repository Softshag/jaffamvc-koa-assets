var views_1 = require('views');
var assets_preview_1 = require('./assets-preview');
assets_preview_1.setPreviewHandler('image/*', views_1.DataView.extend({
    template: function (data) {
        return "<img src=\"" + data.url + "\"/>";
    }
}));
assets_preview_1.setPreviewHandler(['audio/mpeg', 'audio/wav', 'audio/ogg'], views_1.DataView.extend({
    template: function (data) {
        return "\n\t\t\t<audio controls>\n\t\t\t\t<source src=\"" + data.url + "\" type=\"" + data.mime + "\" />\n\t\t\t</audio>\n\t\t";
    }
}));
assets_preview_1.setPreviewHandler(['video/mp4', 'video/ogg', 'video/webm', 'video/x-m4v'], views_1.DataView.extend({
    template: function (data) {
        return "\n\t\t\t<video controls>\n\t\t\t\t<source src=\"" + data.url + "\" type=\"" + data.mime + "\" />\n\t\t\t</video>\n\t\t";
    }
}));
