/// <reference path="../node_modules/views/views.d.ts" />
import {LayoutView, DataView, DataViewOptions, TemplateViewOptions, html} from 'views'
import {IDataView} from 'views/lib/types'
import {truncate,humanFileSize} from './utilities'
import {AssetsModel} from './assets-collection'
import {PreviewTemplate, PreviewInfoTemplate} from './templates'
import {Thumbnailer, MimeList} from './thumbnailer'
export interface PreviewInfoOptions extends DataViewOptions {

}

export var AssetsInfoPreview: typeof DataView = DataView.extend({
	ui: {
		name: '.name',
		mime: '.mime',
		size: '.size',
		download: '.download'
	},
	tagName: 'table',
	className: 'info',
	template: PreviewInfoTemplate,
	setModel (model) {
		if (model == null) return
		this.ui.name.innerText = model.get('name')
		this.ui.mime.innerText = model.get('mime')
		this.ui.size.innerText = humanFileSize(model.get('size'), true);
		let link = this.ui.download.querySelector('a')

		link.innerText = model.get('url');
		link.href = model.get('url') + '?download=true';

	}
});

export type PreviewHandlerConstructor = new (options:DataViewOptions) => IDataView

let previewHandlers: {[key:string]:PreviewHandlerConstructor} = {}

export function setPreviewHandler(mime:string|string[], view: PreviewHandlerConstructor) {
	if (!Array.isArray(mime)) {
		mime = [<string>mime]
	}
	(<string[]>mime).forEach(function (m) {
		previewHandlers[m] = view
	})
}

export function getPreviewHandler(mime:string): PreviewHandlerConstructor {
	let reg: RegExp, k: string;
	for (k in previewHandlers) {
		if ((new RegExp(k)).test(mime)) return previewHandlers[k]
	}
	return null
}

export interface AssetsPreviewOptions extends TemplateViewOptions {
	infoView?: new (options?:PreviewInfoOptions) => IDataView
	infoViewOptions?: PreviewInfoOptions
}


export class AssetsPreview extends LayoutView<HTMLDivElement> {
	private _model: AssetsModel
	private infoView: IDataView

	set model (model:AssetsModel) {

		this._model = model

		this.hideInfoView(model == null ? true : false)
		this.infoView.model = model

		let Handler = getPreviewHandler(model.get('mime'))

		let region = this.regions['preview']

		if (Handler) {
			let view = new Handler({model:model})
			html.addClass(view.el, 'preview')
			region.show(view)

		} else {
			region.empty()
			let image = new Image();
			image.style.maxHeight = '96px'
			image.style.maxWidth = '96px'
			region.el.appendChild(image);
			
			Thumbnailer.request(model)
			.then((test) => {
				image.src = 'data:image/png;base64,' + test
			}).catch((e) => {
				console.log(e)
			})
		}

	}

	get model (): AssetsModel {
		return this._model
	}

	constructor (options:AssetsPreviewOptions={}) {
		this.className = 'assets-preview'
		this.template = PreviewTemplate
		let opts = options.infoViewOptions||{}

		this.infoView = options.infoView ? new options.infoView(opts) : new AssetsInfoPreview(opts)

		super({
			regions: {
				preview: '.preview-region',
				info: '.info-region'
			}
		})
	}

	onRender () {
		this.regions['info'].show(this.infoView)
		this.hideInfoView()
	}

	hideInfoView (hide:boolean = true) {
		this.infoView.el.style.display = hide ? 'none' : 'table'
	}
}
