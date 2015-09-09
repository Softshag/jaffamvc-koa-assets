var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../node_modules/views/views.d.ts" />
var views_1 = require('views');
var utilities_1 = require('./utilities');
var templates_1 = require('./templates');
var thumbnailer_1 = require('./thumbnailer');
exports.AssetsInfoPreview = views_1.DataView.extend({
    ui: {
        name: '.name',
        mime: '.mime',
        size: '.size',
        download: '.download'
    },
    tagName: 'table',
    className: 'info',
    template: templates_1.PreviewInfoTemplate,
    setModel: function (model) {
        if (model == null)
            return;
        this.ui.name.innerText = model.get('name');
        this.ui.mime.innerText = model.get('mime');
        this.ui.size.innerText = utilities_1.humanFileSize(model.get('size'), true);
        var link = this.ui.download.querySelector('a');
        link.innerText = model.get('url');
        link.href = model.get('url') + '?download=true';
    }
});
var previewHandlers = {};
function setPreviewHandler(mime, view) {
    if (!Array.isArray(mime)) {
        mime = [mime];
    }
    mime.forEach(function (m) {
        previewHandlers[m] = view;
    });
}
exports.setPreviewHandler = setPreviewHandler;
function getPreviewHandler(mime) {
    var reg, k;
    for (k in previewHandlers) {
        if ((new RegExp(k)).test(mime))
            return previewHandlers[k];
    }
    return null;
}
exports.getPreviewHandler = getPreviewHandler;
var AssetsPreview = (function (_super) {
    __extends(AssetsPreview, _super);
    function AssetsPreview(options) {
        if (options === void 0) { options = {}; }
        this.className = 'assets-preview';
        this.template = templates_1.PreviewTemplate;
        var opts = options.infoViewOptions || {};
        this.infoView = options.infoView ? new options.infoView(opts) : new exports.AssetsInfoPreview(opts);
        _super.call(this, {
            regions: {
                preview: '.preview-region',
                info: '.info-region'
            }
        });
    }
    Object.defineProperty(AssetsPreview.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (model) {
            this._model = model;
            this.hideInfoView(model == null ? true : false);
            this.infoView.model = model;
            var Handler = getPreviewHandler(model.get('mime'));
            var region = this.regions['preview'];
            region.empty();
            if (Handler) {
                var view = new Handler({ model: model });
                views_1.html.addClass(view.el, 'preview');
                region.show(view);
            }
            else {
                var image = new Image();
                var div = document.createElement('div');
                views_1.html.addClass(div, 'preview');
                region.el.innerHTML = '';
                region.el.appendChild(div);
                thumbnailer_1.Thumbnailer.request(model)
                    .then(function (test) {
                    image.src = 'data:image/png;base64,' + test;
                    div.appendChild(image);
                }).catch(function (e) {
                    console.log(e);
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    AssetsPreview.prototype.onRender = function () {
        this.regions['info'].show(this.infoView);
        this.hideInfoView();
    };
    AssetsPreview.prototype.hideInfoView = function (hide) {
        if (hide === void 0) { hide = true; }
        this.infoView.el.style.display = hide ? 'none' : 'table';
    };
    return AssetsPreview;
})(views_1.LayoutView);
exports.AssetsPreview = AssetsPreview;
