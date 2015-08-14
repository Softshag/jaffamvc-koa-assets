var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../node_modules/views/views.d.ts" />
var collection_view_1 = require('views/lib/collection-view');
var data_view_1 = require('views/lib/data-view');
var utilities_1 = require('./utilities');
exports.AssetsListItem = data_view_1.DataView.extend({
    tagName: 'div',
    triggers: {
        'click': 'click'
    },
    template: function (data) {
        return utilities_1.truncate(data.name, 25);
    }
});
var AssetsListView = (function (_super) {
    __extends(AssetsListView, _super);
    function AssetsListView(options) {
        _super.call(this, options);
        this.childView = exports.AssetsListItem;
        this.sort = true;
        this.listenTo(this, 'childview:click', function (_a) {
            var model = _a.model, view = _a.view;
            this.trigger('selected', view, model);
        });
    }
    return AssetsListView;
})(collection_view_1.CollectionView);
exports.AssetsListView = AssetsListView;
