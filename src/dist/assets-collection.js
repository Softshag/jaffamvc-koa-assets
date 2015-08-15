var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../node_modules/views/views.d.ts" />
var views_1 = require('views');
var request_1 = require('./request');
var AssetsModel = (function (_super) {
    __extends(AssetsModel, _super);
    function AssetsModel() {
        _super.apply(this, arguments);
        this.idAttribute = 'path';
    }
    return AssetsModel;
})(views_1.Model);
exports.AssetsModel = AssetsModel;
var AssetsCollection = (function (_super) {
    __extends(AssetsCollection, _super);
    function AssetsCollection(models, options) {
        _super.call(this, models, options);
        this.Model = AssetsModel;
        this.comparator = 'name';
        this.url = options.url;
    }
    AssetsCollection.prototype.fetch = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return request_1.request.get(this.url)
            .progress(function (e) {
            console.log(e);
        })
            .json().then(function (result) {
            if (!Array.isArray(result)) {
                throw new Error('invalid format: expected json array');
            }
            _this.add(result);
        });
    };
    return AssetsCollection;
})(views_1.Collection);
exports.AssetsCollection = AssetsCollection;
