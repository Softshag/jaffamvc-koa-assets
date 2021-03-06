/// <reference path="../node_modules/views/views.d.ts" />
import {Collection, CollectionOptions,Model} from 'views'
import {request} from './request'

export interface AssetsCollectionOptions extends CollectionOptions<AssetsModel> {
	url: string
}

export interface AssetsCollectionFetchOption {

}

export class AssetsModel extends Model {
	idAttribute = 'path'
}

export class AssetsCollection extends Collection<AssetsModel> {
	Model = AssetsModel
	comparator = 'name'
	url: string

	constructor (models, options:AssetsCollectionOptions) {
		super(models, options)
		this.url = options.url
	}

	fetch (options:AssetsCollectionFetchOption = {}, progress?:() => void): Promise<any> {

		return request.get(this.url)
		.progress(function (e) {
			progress ? progress() : void 0
		})
		.json().then((result: Object) => {
			if (!Array.isArray(result)) {
				throw new Error('invalid format: expected json array')
			}

			this.reset(result)
			
			return this.models;
		})



	}


}
