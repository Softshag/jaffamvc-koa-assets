/// <reference path="../node_modules/views/views.d.ts" />
import {CollectionView, CollectionViewOptions, DataView, html} from 'views'
import {truncate} from './utilities'
import {AssetsModel} from './assets-collection';
import {AssetListItemTemplate} from './templates'
import {Thumbnailer} from './thumbnailer';
import {attributes} from './gallery'


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

		this.ui.name.innerText = truncate(model.get('name'), 25)

		Thumbnailer.request(model)
		.then((test) => {
			let image = new Image();
			image.src = 'data:image/png;base64,' + test
			//image.style.maxHeight = '96px'
			//image.style.maxWidth = '96px'
			this.ui.mime.parentNode.replaceChild(image, this.ui.mime);
		}).catch((e) => {
			console.log(e)
		})
	}
})


@attributes({className:'assets-list collection-mode', childView: AssetsListItem})
export class AssetsListView extends CollectionView<HTMLDivElement> {
	_current: DataView<HTMLDivElement>
	constructor (options?:AssetsListOptions) {
		super(options);
		this.sort = true
	
		this.listenTo(this, 'childview:click', function (view, model) {
			if (this._current) html.removeClass(this._current.el, 'active')
			this._current = view
			html.addClass(view.el, 'active')		
			this.trigger('selected', view, model);
		});

		this.listenTo(this, 'childview:remove', function (view, model) {

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
}
