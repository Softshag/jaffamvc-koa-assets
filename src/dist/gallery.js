var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var views_1 = require('views');
var templates = require('./templates');
var assets_list_1 = require('./assets-list');
var assets_preview_1 = require('./assets-preview');
var assets_collection_1 = require('./assets-collection');
var filebutton_1 = require('./filebutton');
function template(name) {
    return function (target) {
        var t;
        if (!(t = templates[name])) {
            throw new Error('could not find template: ' + template);
        }
        target.prototype.template = t;
    };
}
exports.template = template;
function attributes(attrs) {
    return function (target) {
        views_1.utils.extend(target.prototype, attrs);
    };
}
exports.attributes = attributes;
var GalleryView = (function (_super) {
    __extends(GalleryView, _super);
    function GalleryView(options) {
        if (options === void 0) { options = {}; }
        options.regions = {
            list: '.gallery-list',
            preview: '.gallery-preview',
            upload: '.gallery-upload'
        };
        if (!options.url && !options.collection) {
            throw new Error('either specify url or collection');
        }
        _super.call(this, options);
        var collection = options.collection ? options.collection : new assets_collection_1.AssetsCollection(null, {
            url: options.url
        });
        this.collection = collection;
        this._listView = new assets_list_1.AssetsListView({
            collection: collection
        });
        this._preView = new assets_preview_1.AssetsPreview();
        this._uploadButton = new filebutton_1.UploadButton({
            autoUpload: true,
            url: collection.url,
            maxSize: 1024 * 1000,
        });
        this.listenTo(this._listView, 'selected', this._onItemSelect);
        this.listenTo(this._listView, 'remove', this._onItemRemove);
        this.listenTo(this._uploadButton, 'upload', this._onItemCreate);
        collection.fetch();
    }
    Object.defineProperty(GalleryView.prototype, "listView", {
        get: function () {
            return this._listView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GalleryView.prototype, "preView", {
        get: function () {
            return this._preView;
        },
        enumerable: true,
        configurable: true
    });
    GalleryView.prototype.onRender = function () {
        this.regions['list'].show(this._listView);
        this.regions['preview'].show(this._preView);
        this.regions['upload'].show(this._uploadButton);
    };
    GalleryView.prototype._onItemCreate = function (asset) {
        this.collection.create(asset);
    };
    GalleryView.prototype._onItemSelect = function (_a) {
        var model = _a.model;
        if (this._preView.model == model)
            return;
        this._preView.model = model;
    };
    GalleryView.prototype._onItemRemove = function (_a) {
        var model = _a.model;
    };
    GalleryView = __decorate([
        template('gallery'),
        attributes({ className: 'assets-gallery gallery', tagName: 'div', ui: { button: '.upload-button' } }), 
        __metadata('design:paramtypes', [Object])
    ], GalleryView);
    return GalleryView;
})(views_1.LayoutView);
exports.GalleryView = GalleryView;
