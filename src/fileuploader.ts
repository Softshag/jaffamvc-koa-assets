/// <reference path="typings/tsd.d.ts" />

import {EventEmitter} from 'views/lib/events'
import {utils} from 'views/lib/utils'
import {ajax} from './utilities'
import {Request} from './request'

export enum HttpMethod {
  GET, POST, PUT, DELETE
}

export class HttpError implements Error {
  name: string
  message: string
  code: number
  constructor (message: string, code: number) {
    this.message = message
    this.code = code
  }
}

export interface FileUploaderOptions {
    url: string
    method?: HttpMethod
    maxSize?: number
    mimeType?: string[]|string
    parameter?: string
}

export type FileUploadResult = any

export interface FileUploadProgress {
  (progress: number, total: number)
}



export default class FileUploader extends EventEmitter {
    options: FileUploaderOptions
    constructor(options: FileUploaderOptions) {
        super()
        this.options = utils.extend({}, {
          parameter: 'file',
          method: HttpMethod.POST,
          maxSize: 2048
        }, options)
    }

    upload(file: File, progressFn?:FileUploadProgress, attributes?:Object): Promise<Object> {

        try {
          this._validateFile(file);
        } catch (e) {
          return Promise.reject(e)
          //return Promise.reject<FileUploadResult>(e)
        }

        let formData = new FormData()

        formData.append(this.options.parameter, file)

        attributes = attributes || {};

        Object.keys(attributes).forEach(function (key) {
          var value = attributes[key];
          formData.append(key, value);
        });
        
        let method: string = HttpMethod[this.options.method]
        
        let request = new Request(method,this.options.url)
        
        return request
        .progress( (event:ProgressEvent) => {
          if (event.lengthComputable) {
             let progress = (event.loaded / event.total * 100 || 0);
             this.trigger('progress', file, progress);
             
             if (progressFn != null) {
               progressFn(event.loaded, event.total)
             }
            }
        })
        .json(formData)

        /*
        return new Promise<FileUploadResult>((resolve, reject) => {

          let xhr = ajax();

          let method: string = HttpMethod[this.options.method]
          xhr.open(method,this.options.url)

          xhr.onerror = () => {
            let error = new HttpError(xhr.statusText, xhr.status)
            this.trigger('error', error)
            reject(error);
          }

          xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return

            let response = formatResponse(xhr.responseText)

            if (xhr.status === 200 || xhr.status === 201) {
              resolve(response)
              this.trigger('complete');
            } else {

              reject(response)
            }

          }

          xhr.upload.onprogress = (event) => {
            console.log('progress', event)
            if (event.lengthComputable) {
              var progress = (event.loaded / event.total * 100 || 0);
              this.trigger('progress', file, progress);
              console.log(event, progress)
              if (progressFn != null) {

                progressFn(event.loaded, event.total)
              }
            }
          }

          xhr.send(formData)
        });*/
    }

    private _validateFile (file: File) {
      /*if (typeof this.options.maxSize === 'function') {
        if (!this.options.maxSize(file))
          return new Error('file too big');
      } else if ((this.options.maxSize !== 0) &&
        (file.size > this.options.maxSize))  {
        return new Error('File too big');
      }*/
      let maxSize = this.options.maxSize * 1000
      console.log(`maxsize ${maxSize}, filesize ${file.size}`)
      if (maxSize !== 0 && file.size > maxSize) {
        throw new Error('file to big');
      }

      var type = file.type;

      var mimeTypes: any

      if (typeof this.options.mimeType === 'string') {
        mimeTypes = [this.options.mimeType];
      } else {
        mimeTypes = this.options.mimeType;
      }

      if (!mimeTypes) return;


      for (var i = 0; i < mimeTypes.length; i++ ) {
        let mime = new RegExp(mimeTypes[i].replace('*','.*'));
        if (mime.test(type))
          return
        else
          throw new Error('Wrong mime type');
      }

    }
}

function formatResponse (response): any {
  var ret = null;
  try {
    ret = JSON.parse(response);
  } catch (e) {
    ret = response;
  }
  return ret;
}
