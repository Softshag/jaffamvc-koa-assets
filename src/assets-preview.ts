/// <reference path="../node_modules/views/views.d.ts" />
import {LayoutView} from 'views/lib/layout-view'
import {DataView} from 'views/lib/data-view'
import {truncate} from './utilities'
import {AssetsModel} from './assets-collection'

const Template =`
<div class="preview-region">	
</div>
<div class="info-region></div>
`


export class AssetsPreview extends LayoutView<HTMLDivElement> {
	private _model: AssetsModel
	
	set model (model:AssetsModel) {
		
	}
	
	get model (): AssetsModel {
		return this._model
	}
	
	constructor (options) {
		
		this.template = Template
		
		super({
			regions: {
				preview: '.preview-region',
				info: '.info-region'
			}
		})
	}
	
	initialize () {
		console.log('initialize')
	}
}