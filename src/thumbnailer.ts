import {request} from './request'
import {AssetsModel} from './assets-collection'


export const MimeList = {
	'audio/mpeg': 'audio-generic',
	'audio/ogg': 'audio-generic',
	'application/pdf': 'application-pdf',
	'video/ogg': 'video-generic',
	'video/mp4': 'video-generic',
	'video/x-m4v': 'video-generic',
	'video/quicktime': 'video-generic'
}

export class Thumbnailer {

  static request (asset:AssetsModel): Promise<string> {
    return request.get('/files/' + asset.get('path')).end({
      thumbnail: true,
      base64: true
    })
  }
}
