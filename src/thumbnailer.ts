import {request} from './request'
import {AssetsModel} from './assets-collection'
export class Thumbnailer {

  static request (asset:AssetsModel): Promise<string> {
    console.log('request')
    return request.get('/files/' + asset.get('path')).end({
      thumbnail: true,
      base64: true
    })
  }
}
