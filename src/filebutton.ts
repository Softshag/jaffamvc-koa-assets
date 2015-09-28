/// <reference path="../node_modules/views/views.d.ts" />
import FileUploader from './fileuploader'
import {ViewOptions, View, utils} from 'views'
//import {utils} from 'views/lib/utils'

export interface IProgressView {
  show()
  hide()
  setProgress(progress: number, total: number, percent: number)
}

export interface IMessageView {
  show()
  hide()
  setMessage(msg: string)
}

export interface UploadButtonOptions extends ViewOptions {
  maxSize?: number
  mimeType?: string[]|string
  autoUpload?: boolean
  url: string,
  progressView?: IProgressView
  errorView?: IMessageView
  uploader?: FileUploader
}

let defaults = {maxSize:2048, mimeType:'*', autoUpload:false}

class MessageView extends View<HTMLParagraphElement> implements IMessageView {

  show () { this.el.style.display = 'block' }

  hide () { this.el.style.display = 'none' }

  setMessage (msg: string) {
    this.el.innerText = msg
  }
}

class ProgressView extends View<HTMLDivElement> implements IProgressView {
  show () { this.el.style.display = 'block' }
  hide () { this.el.style.display = 'none' }
  setProgress (progress: number, total: number, percent: number) {
    percent = Math.floor(percent*100) / 100
    this.el.innerText = `${percent}/100`
  }
}

export function createButton (options:UploadButtonOptions) : any {
  let progressView = new ProgressView()
  let errorView = new MessageView()
  options.progressView = progressView
  options.errorView = errorView


  let uploadButton = new UploadButton(options)

  let div = document.createElement('div')

  div.appendChild(uploadButton.el)
  progressView.appendTo(div)
  errorView.appendTo(div)

  return div

}


export class UploadButton extends View<HTMLInputElement> {


  options: UploadButtonOptions
  progressView: IProgressView
  errorView: IMessageView
  private uploader: FileUploader


  constructor(options: UploadButtonOptions) {

    options.tagName = 'input'
    options.attributes = {type:'file'}
    options.className = 'file-input-button'


    this.options = utils.extend({}, defaults,options)

    utils.extend(this, utils.pick(this.options, ['errorView','progressView']))

    this.uploader = this.options.uploader|| new FileUploader(options)

    this.events = {
      'change': '_onChange'
    }

    super(options)

  }


  private _onChange (e: Event) {

    this.hideErrorView()

    let files = this.el.files
    if (files.length === 0) return

    let file = files[0]

    this.trigger('change', file);

    if (this.options.autoUpload === true) {
      this.upload(file)
    }

  }

  private upload (file: File) {
    let pv = this.progressView
    if (pv != null) {
      pv.show()
    }

    this.uploader.upload(file, (progress, total) => {
      this.trigger('progress', { progress, total })
      this.showProgress(progress, total)
    }).then((result) => {
      this.trigger('upload', result)
      if (pv != null) pv.hide()
      this.clear()
    }).catch((e) => {
      this.showErrorMessage(e)
      this.clear()
      if (pv != null) pv.hide()
    })
  }

  private clear () {
    try {
      this.el.value = '';
      if (this.el.value) {
        this.el.type = 'text';
        this.el.type = 'file'
      }
    } catch (e) {
      console.error('could not clear file-input')
    }
  }

  private showErrorMessage (error: Error) {

    if (this.errorView != null) {
      this.errorView.setMessage(error.message)
      this.errorView.show()
    }
  }

  private hideErrorView () {
    if (this.errorView) {
      this.errorView.hide()
    }
  }

  private showProgress (progress: number, total: number) {
    if (this.progressView != null) {
      let percent = (progress / total) * 100
      this.progressView.setProgress(progress, total, percent)
    }
  }


}
