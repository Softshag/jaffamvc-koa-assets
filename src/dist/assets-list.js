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
/// <reference path="../node_modules/views/views.d.ts" />
var views_1 = require('views');
var utilities_1 = require('./utilities');
var templates_1 = require('./templates');
var thumbnailer_1 = require('./thumbnailer');
var gallery_1 = require('./gallery');
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
        this.ui.name.innerText = utilities_1.truncate(model.get('name'), 25);
        thumbnailer_1.Thumbnailer.request(model)
            .then(function (test) {
            var image = new Image();
            image.src = 'data:image/png;base64,' + test;
            //image.style.maxHeight = '96px'
            //image.style.maxWidth = '96px'
            _this.ui.mime.parentNode.replaceChild(image, _this.ui.mime);
        }).catch(function (e) {
            console.log(e);
        });
    }
});
var AssetsListView = (function (_super) {
    __extends(AssetsListView, _super);
    function AssetsListView(options) {
        _super.call(this, options);
        this.sort = true;
        this.listenTo(this, 'childview:click', function (view, model) {
            if (this._current)
                views_1.html.removeClass(this._current.el, 'active');
            this._current = view;
            views_1.html.addClass(view.el, 'active');
            this.trigger('selected', view, model);
        });
        this.listenTo(this, 'childview:remove', function (view, model) {
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
    AssetsListView = __decorate([
        gallery_1.attributes({ className: 'assets-list collection-mode', childView: exports.AssetsListItem }), 
        __metadata('design:paramtypes', [Object])
    ], AssetsListView);
    return AssetsListView;
})(views_1.CollectionView);
exports.AssetsListView = AssetsListView;
