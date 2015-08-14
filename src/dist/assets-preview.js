var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../node_modules/views/views.d.ts" />
var layout_view_1 = require('views/lib/layout-view');
var Template = "\n<div class=\"preview-region\">\t\n</div>\n<div class=\"info-region></div>\n";
var AssetsPreview = (function (_super) {
    __extends(AssetsPreview, _super);
    function AssetsPreview(options) {
        this.template = Template;
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
        },
        enumerable: true,
        configurable: true
    });
    AssetsPreview.prototype.initialize = function () {
        console.log('initialize');
    };
    return AssetsPreview;
})(layout_view_1.LayoutView);
exports.AssetsPreview = AssetsPreview;
