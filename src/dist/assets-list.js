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
var gallery_1 = require('./gallery');
var Blazy = require('blazy');
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
        var model = this.model;
        var mime = model.get('mime'); //.replace(/\//, '-')
        mime = MimeList[mime];
        if (mime) {
            views_1.html.addClass(this.ui.mime, 'mime-' + mime);
            views_1.html.removeClass(this.ui.mime, 'mime-unknown');
        }
        this.ui.name.innerText = utilities_1.truncate(model.get('name'), 25);
        var img = new Image();
        img.src = "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI=";
        img.setAttribute('data-src', "/files/" + model.get('path') + "?thumbnail=true");
        this.ui.mime.parentNode.insertBefore(img, this.ui.mime);
        this.ui.mime.style.display = 'none';
        this.trigger('image');
        /*Thumbnailer.has(model)
        .then((test) => {
            let image = new Image();
            //image.src = "data:base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI="
            image.setAttribute('data-src',test)
            
            this.ui.mime.parentNode.replaceChild(image, this.ui.mime);
            this.trigger('image')
        }).catch((e) => {
                console.error(model.get('mime'), e)
        })*/
    }
});
exports.AssetsEmptyView = views_1.DataView.extend({
    template: 'Empty view'
});
var AssetsListView = (function (_super) {
    __extends(AssetsListView, _super);
    function AssetsListView(options) {
        _super.call(this, options);
        this.sort = false;
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
        this.listenTo(this, 'childview:image', function (view) {
            var img = view.$('img')[0];
            if (img.src === img.getAttribute('data-src')) {
                return;
            }
            this._blazy.load(view.$('img')[0], (elementInView(view.el, this.el)));
        });
        this._initBlazy();
    }
    AssetsListView.prototype.onRenderCollection = function () {
        if (this._blazy) {
            this._blazy.revalidate();
        }
        else {
            this._initBlazy();
        }
    };
    AssetsListView.prototype._initBlazy = function () {
        this._blazy = new Blazy({
            container: '.gallery',
            selector: 'img',
            error: function (img) {
                console.log(arguments);
                var m = img.parentNode.querySelector('.mime-type');
                if (m) {
                    m.style.display = 'block';
                    img.style.display = 'none';
                }
            }
        });
    };
    AssetsListView = __decorate([
        gallery_1.attributes({ className: 'assets-list collection-mode',
            childView: exports.AssetsListItem, emptyView: exports.AssetsEmptyView,
            events: {
                'scroll': throttle(function () {
                    var index = this.index ? this.index : (this.index = 0), len = this.children.length;
                    for (var i = index; i < len; i++) {
                        var view = this.children[i], img = view.$('img')[0];
                        if (img == null)
                            continue;
                        if (img.src === img.getAttribute('data-src')) {
                            index = i;
                        }
                        else if (elementInView(img, this.el)) {
                            index = i;
                            this._blazy.load(img, true);
                        }
                    }
                    this.index = index;
                }, 100)
            } }), 
        __metadata('design:paramtypes', [Object])
    ], AssetsListView);
    return AssetsListView;
})(views_1.CollectionView);
exports.AssetsListView = AssetsListView;
function elementInView(ele, container) {
    var viewport = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    };
    viewport.bottom = (container.innerHeight || document.documentElement.clientHeight); // + options.offset;
    viewport.right = (container.innerWidth || document.documentElement.clientWidth); // + options.offset;
    var rect = ele.getBoundingClientRect();
    return (
    // Intersection
    rect.right >= viewport.left
        && rect.bottom >= viewport.top
        && rect.left <= viewport.right
        && rect.top <= viewport.bottom) && !ele.classList.contains('b-error');
}
function throttle(fn, minDelay) {
    var lastCall = 0;
    return function () {
        var now = +new Date();
        if (now - lastCall < minDelay) {
            return;
        }
        lastCall = now;
        fn.apply(this, arguments);
    };
}
