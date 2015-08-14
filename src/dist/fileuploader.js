/// <reference path="typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var events_1 = require('views/lib/events');
var utils_1 = require('views/lib/utils');
var request_1 = require('./request');
(function (HttpMethod) {
    HttpMethod[HttpMethod["GET"] = 0] = "GET";
    HttpMethod[HttpMethod["POST"] = 1] = "POST";
    HttpMethod[HttpMethod["PUT"] = 2] = "PUT";
    HttpMethod[HttpMethod["DELETE"] = 3] = "DELETE";
})(exports.HttpMethod || (exports.HttpMethod = {}));
var HttpMethod = exports.HttpMethod;
var HttpError = (function () {
    function HttpError(message, code) {
        this.message = message;
        this.code = code;
    }
    return HttpError;
})();
exports.HttpError = HttpError;
var FileUploader = (function (_super) {
    __extends(FileUploader, _super);
    function FileUploader(options) {
        _super.call(this);
        this.options = utils_1.utils.extend({}, {
            parameter: 'file',
            method: HttpMethod.POST,
            maxSize: 2048
        }, options);
    }
    FileUploader.prototype.upload = function (file, progressFn, attributes) {
        var _this = this;
        try {
            this._validateFile(file);
        }
        catch (e) {
            return Promise.reject(e);
        }
        var formData = new FormData();
        formData.append(this.options.parameter, file);
        attributes = attributes || {};
        Object.keys(attributes).forEach(function (key) {
            var value = attributes[key];
            formData.append(key, value);
        });
        var method = HttpMethod[this.options.method];
        var request = new request_1.Request(method, this.options.url);
        return request
            .progress(function (event) {
            if (event.lengthComputable) {
                var progress = (event.loaded / event.total * 100 || 0);
                _this.trigger('progress', file, progress);
                if (progressFn != null) {
                    progressFn(event.loaded, event.total);
                }
            }
        })
            .json(formData);
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
    };
    FileUploader.prototype._validateFile = function (file) {
        /*if (typeof this.options.maxSize === 'function') {
          if (!this.options.maxSize(file))
            return new Error('file too big');
        } else if ((this.options.maxSize !== 0) &&
          (file.size > this.options.maxSize))  {
          return new Error('File too big');
        }*/
        var maxSize = this.options.maxSize * 1000;
        console.log("maxsize " + maxSize + ", filesize " + file.size);
        if (maxSize !== 0 && file.size > maxSize) {
            throw new Error('file to big');
        }
        var type = file.type;
        var mimeTypes;
        if (typeof this.options.mimeType === 'string') {
            mimeTypes = [this.options.mimeType];
        }
        else {
            mimeTypes = this.options.mimeType;
        }
        if (!mimeTypes)
            return;
        for (var i = 0; i < mimeTypes.length; i++) {
            var mime = new RegExp(mimeTypes[i].replace('*', '.*'));
            if (mime.test(type))
                return;
            else
                throw new Error('Wrong mime type');
        }
    };
    return FileUploader;
})(events_1.EventEmitter);
exports.default = FileUploader;
function formatResponse(response) {
    var ret = null;
    try {
        ret = JSON.parse(response);
    }
    catch (e) {
        ret = response;
    }
    return ret;
}
