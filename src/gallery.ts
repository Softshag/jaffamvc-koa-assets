
import {BaseObject, ViewOptions, LayoutView, utils, CollectionView} from 'views'
import * as templates from './templates'
import {AssetsListView} from './assets-list'
import {AssetsPreview} from './assets-preview'
import {AssetsCollection} from './assets-collection'
import {UploadButton} from './filebutton'

export function template (name:string): ClassDecorator {
	return function <T extends Function>(target:T) {
		let t
		if (!(t = templates[name])) {
			throw new Error('could not find template: ' + template)
		}
		target.prototype.template = t
	}
}

export function attributes(attrs:Object): ClassDecorator {
	return function <T extends Function>(target:T) {
		utils.extend(target.prototype, attrs)
	}
}

export interface GalleryViewOptions extends ViewOptions {
	uploadButton?: boolean
	collection?: AssetsCollection
	url?: string
	removeable?: boolean
}

@template('gallery')
@attributes({className:'assets-gallery gallery', tagName:'div',ui:{button:'.upload-button'}})
export class GalleryView extends LayoutView<HTMLDivElement> {
	collection: AssetsCollection
	private _listView: AssetsListView
	private _preView: AssetsPreview	
	private _uploadButton: UploadButton
	
	get listView (): AssetsListView {
		return this._listView
	}
	
	get preView (): AssetsPreview {
		return this._preView
	}
	
	constructor(options:GalleryViewOptions={}) {
		(<any>options).regions =  {
			list: '.gallery-list',
			preview: '.gallery-preview',
			upload: '.gallery-upload'
		}
		
		if (!options.url && !options.collection) {
			throw new Error('either specify url or collection');
		}
		
		super(options)
		
		let collection = options.collection ? options.collection : new AssetsCollection(null,{
			url: options.url
		});
		
		this.collection = collection
		
		this._listView = new AssetsListView({
			collection: collection
		});
		
		this._preView = new AssetsPreview();
		
		this._uploadButton = new UploadButton({
			autoUpload: true,
			url: collection.url,
			maxSize: 1024*1000,
			//mimeType: 'image/*'
		});
		
		this.listenTo(this._listView, 'selected', this._onItemSelect);
		this.listenTo(this._listView, 'remove', this._onItemRemove)
		this.listenTo(this._uploadButton, 'upload', this._onItemCreate);
		collection.fetch()
	}	
	
	onRender () {
		this.regions['list'].show(this._listView);
		this.regions['preview'].show(this._preView)
		this.regions['upload'].show(this._uploadButton)
		
	}
	
	private _onItemCreate (asset) {
	
		this.collection.create(asset)
	}
	
	private _onItemSelect ({model}) {
		if (this._preView.model == model) return
	
		this._preView.model = model
	}
	
	private _onItemRemove ({model}) {
		
	}
	
	
}