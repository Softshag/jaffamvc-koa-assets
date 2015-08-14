/// <reference path="../node_modules/views/views.d.ts" />
import {CollectionView, CollectionViewOptions} from 'views/lib/collection-view'
import {DataView} from 'views/lib/data-view'
import {truncate} from './utilities'

export interface AssetsListOptions extends CollectionViewOptions {
	
}

export const AssetsListItem = DataView.extend({
	tagName: 'div',
	triggers: {
		'click': 'click'
	},
	template: function (data) {
		return truncate(data.name, 25)
	}
})

export class AssetsListView extends CollectionView<HTMLDivElement> {
	childView = AssetsListItem
	constructor (options?:AssetsListOptions) {
		
		super(options)
		this.sort = true
		this.listenTo(this, 'childview:click', function ({model, view}) {
			this.trigger('selected', view, model);
		})
	}
		
}