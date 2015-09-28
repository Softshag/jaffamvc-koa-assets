/// <reference path="../node_modules/views/views.d.ts" />
import {CollectionView, CollectionViewOptions, DataView, html} from 'views'
import {truncate} from './utilities'
import {AssetsModel} from './assets-collection';
import {AssetListItemTemplate} from './templates'
import {Thumbnailer} from './thumbnailer';
import {attributes} from './gallery'

const Blazy = require('blazy')

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

		let img = new Image();
		img.src = "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI="
		img.setAttribute('data-src', `/files/${model.get('path')}?thumbnail=true`)

		this.ui.mime.parentNode.insertBefore(img, this.ui.mime);
		this.ui.mime.style.display = 'none'
		this.trigger('image')
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
})

export const AssetsEmptyView = DataView.extend({
	template: 'Empty view'
})


@attributes({className:'assets-list collection-mode',
	childView: AssetsListItem, emptyView: AssetsEmptyView,
	events: {
		'scroll': throttle(function () {
			let index = this.index ? this.index : (this.index = 0),
				len = this.children.length

			for (let i = index;i<len;i++) {
				let view = this.children[i],
					img = view.$('img')[0]
					if (img == null) continue
					if (img.src === img.getAttribute('data-src')) {
						index = i;
					} else if (elementInView(img, this.el)) {
						index = i
						this._blazy.load(img, true);
					}
			}
			this.index = index
		}, 100)
	} })

export class AssetsListView extends CollectionView<HTMLDivElement> {
	_current: DataView<HTMLDivElement>
	private _blazy: Blazy
	constructor (options?:AssetsListOptions) {
		super(options);
		this.sort = false

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

		this.listenTo(this, 'childview:image', function (view) {
			let img = view.$('img')[0]
			if (img.src === img.getAttribute('data-src')) {
				return;
			}
      this._blazy.load(view.$('img')[0], elementInView(view.el, this.el));
		});

		this._initBlazy()

	}

	onRenderCollection () {
		if (this._blazy) {
			this._blazy.revalidate();
		} else {
			this._initBlazy();
		}

	}

	_initBlazy () {
		this._blazy = new Blazy({
			container: '.gallery',
			selector: 'img',
			error: function (img) {
				console.log(arguments)
				let m = img.parentNode.querySelector('.mime-type')
				if (m) {
					m.style.display = 'block'
					img.style.display = 'none'
				}
			}
		});
	}

}

function elementInView(ele, container) {

		var viewport = {
			top: 0,
			left: 0,
			bottom: 0,
			right: 0
		};
		viewport.bottom = (container.innerHeight || document.documentElement.clientHeight)// + options.offset;
		viewport.right = (container.innerWidth || document.documentElement.clientWidth)// + options.offset;
		var rect = ele.getBoundingClientRect();

		return (
			// Intersection
			rect.right >= viewport.left
			&& rect.bottom >= viewport.top
			&& rect.left <= viewport.right
			&& rect.top <= viewport.bottom
		 ) && !ele.classList.contains('b-error');
}

function throttle(fn, minDelay) {
     		 var lastCall = 0;
		 return function() {
			 var now = +new Date();
         		 if (now - lastCall < minDelay) {
           			 return;
			 }
         		 lastCall = now;
         		 fn.apply(this, arguments);
       		 };
	 }