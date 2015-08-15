/// <reference path="../node_modules/views/views.d.ts" />
var views_1 = require('views');
var utilities_1 = require('./utilities');
var templates_1 = require('./templates');
var thumbnailer_1 = require('./thumbnailer');
var MimeList = {
    'audio/mpeg': 'audio-generic',
    'audio/ogg': 'audio-generic',
    'application/pdf': 'application-pdf',
    'video/ogg': 'video-generic',
    'video/mp4': 'video-generic',
    'video/x-m4v': 'video-generic',
    'video/quicktime': 'video-generic'
};
exports.AssetsListItem = views_1.DataView.extend({
    template: templates_1.AssetListItemTemplate,
    className: 'assets-list-item',
    tagName: 'div',
    ui: {
        remove: '.remove',
        name: '.name',
        mime: '.mime-type'
    },
    triggers: {
        'click': 'click',
        'click @ui.remove': 'remove'
    },
    onRender: function () {
        var _this = this;
        var model = this.model;
        var mime = model.get('mime'); //.replace(/\//, '-')
        mime = MimeList[mime];
        if (mime) {
            views_1.html.addClass(this.ui.mime, 'mime-' + mime);
            views_1.html.removeClass(this.ui.mime, 'mime-unknown');
        }
        this.ui.name.innerText = utilities_1.truncate(model.get('name'), 15);
        thumbnailer_1.Thumbnailer.request(model)
            .then(function (test) {
            var image = new Image();
            image.src = 'data:image/png;base64,' + test;
            image.style.maxHeight = '96px';
            image.style.maxWidth = '96px';
            _this.ui.mime.parentNode.replaceChild(image, _this.ui.mime);
        }).catch(function (e) {
            console.log(e);
        });
    }
});
exports.AssetsListView = views_1.CollectionView.extend({
    className: 'assets-list collection-mode',
    childView: exports.AssetsListItem,
    constructor: function (options) {
        views_1.CollectionView.call(this, options);
        this.sort = true;
        this.listenTo(this, 'childview:click', function (_a) {
            var model = _a.model, view = _a.view;
            this.trigger('selected', view, model);
        });
        this.listenTo(this, 'childview:remove', function (_a) {
            var model = _a.model, view = _a.view;
            if (options.deleteable === true) {
                var remove = true;
                if (model.has('deleteable')) {
                    remove = !!model.get('deleteable');
                }
                if (remove)
                    this.collection.remove(model);
            }
            else {
            }
        });
    }
});
