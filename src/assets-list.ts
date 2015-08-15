/// <reference path="../node_modules/views/views.d.ts" />
import {CollectionView, CollectionViewOptions, DataView, html} from 'views'
import {truncate} from './utilities'
import {AssetsModel} from './assets-collection';
import {AssetListItemTemplate} from './templates'
import {Thumbnailer} from './thumbnailer';

export interface AssetsListOptions extends CollectionViewOptions {
	deleteable?: boolean
}

const MimeList = {
	'audio/mpeg': 'audio-generic',
	'audio/ogg': 'audio-generic',
	'application/pdf': 'application-pdf',
	'video/ogg': 'video-generic',
	'video/mp4': 'video-generic',
	'video/x-m4v': 'video-generic',
	'video/quicktime': 'video-generic'
}

export const AssetsListItem = DataView.extend({
	template: AssetListItemTemplate,
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
	onRender () {
		let model = this.model
		let mime = model.get('mime') //.replace(/\//, '-')

		mime = MimeList[mime]

		if (mime) {
			html.addClass(this.ui.mime, 'mime-' + mime);
			html.removeClass(this.ui.mime, 'mime-unknown')
		}

		this.ui.name.innerText = truncate(model.get('name'), 15)

		Thumbnailer.request(model)
		.then((test) => {
			let image = new Image();
			image.src = 'data:image/png;base64,' + test
			image.style.maxHeight = '96px'
			image.style.maxWidth = '96px'
			this.ui.mime.parentNode.replaceChild(image, this.ui.mime);
		}).catch((e) => {
			console.log(e)
		})
	}
})

export const AssetsListView = CollectionView.extend({
	className: 'assets-list collection-mode',
	childView: AssetsListItem,
	constructor (options?:AssetsListOptions) {
		CollectionView.call(this, options);
		this.sort = true
		this.listenTo(this, 'childview:click', function ({model, view}) {
			this.trigger('selected', view, model);
		});

		this.listenTo(this, 'childview:remove', function ({model, view}) {

			if (options.deleteable === true) {
				let remove = true;
				if (model.has('deleteable')) {
					remove = !!model.get('deleteable');
				}
				if (remove) this.collection.remove(model);
			} else {

			}
		});
	}

})
