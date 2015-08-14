import {ajax} from './utilities'

  let xmlRe = /^(?:application|text)\/xml/,
      jsonRe = /^application\/json/,
      fileProto = /^file:/;

export interface Deferrable<U> {
  promise: Promise<U>
  done: (error:Error,result:U) => void
  reject: (error:Error) => void
  resolve: (result:U) => void
}

function deferred<U>(): Deferrable<U> {
  let resolve, reject, promise = new Promise<U>(function (res, rej) {
    resolve = res, reject = rej
  });
  return {resolve,reject,promise,
    done: function (error: Error, result: U) {
      if (error) return reject(error)
      resolve(result)
    }
  }
}

var isValid = function(xhr, url) {
    return (xhr.status >= 200 && xhr.status < 300) ||
      (xhr.status === 304) ||
      (xhr.status === 0 && fileProto.test(url));
      //(xhr.status === 0 && window.location.protocol === 'file:')
  };
  
export class Request {
   
    private _xhr: XMLHttpRequest
    private _data: any
    constructor (private _method: string, private _url: string) {
      this._xhr = ajax()
    }
    
    send (data): Request {
      this._data = data;
      return this;
    }

    withCredentials (ret): Request {
      this._xhr.withCredentials = ret;
      return this;
    }

    end (data): Promise<string> {
      this._data = data||this._data;

      let defer = deferred<string>();

      this._xhr.addEventListener('readystatechange', () => {
        if (this._xhr.readyState !== XMLHttpRequest.DONE) return;

        if (!isValid(this._xhr, this._url)) {
          return defer.reject(new Error('server responded with: ' + this._xhr.status));
        }
        
   
        defer.resolve(this._xhr.responseText);

      });

      this._xhr.open(this._method, this._url, true);

      this._xhr.send(this._data);

      return defer.promise;

    }
    
    json (data?: any): Promise<Object> {
      
      return this.end(data)
      .then<Object>((str) => {
        let accepts = this._xhr.getResponseHeader('content-type')
        
        if (jsonRe.test(accepts) && str !== '') {
          let json = JSON.parse(str)
          return json
        } else {
          throw new Error('json')
        }
        
      
      })
    }
    
    progress (fn) {
      this._xhr.addEventListener('progress', fn);
      return this;
    }
    
    header (field: string, value: string): Request {
      this._xhr.setRequestHeader(field,value)
      return this
    }  
  }



export module request {
  export function get (url): Request {
      return new Request('GET', url)
  }

  export function post (url): Request {
      return new Request('POST', url)
  }

  export function put (url): Request {
      return new Request('PUT', url)
    }
    
    export function del (url): Request {
      return new Request('DELETE', url)
    }
}
