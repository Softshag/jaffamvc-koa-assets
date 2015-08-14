var utilities_1 = require('./utilities');
var xmlRe = /^(?:application|text)\/xml/, jsonRe = /^application\/json/, fileProto = /^file:/;
function deferred() {
    var resolve, reject, promise = new Promise(function (res, rej) {
        resolve = res, reject = rej;
    });
    return { resolve: resolve, reject: reject, promise: promise,
        done: function (error, result) {
            if (error)
                return reject(error);
            resolve(result);
        }
    };
}
var isValid = function (xhr, url) {
    return (xhr.status >= 200 && xhr.status < 300) ||
        (xhr.status === 304) ||
        (xhr.status === 0 && fileProto.test(url));
    //(xhr.status === 0 && window.location.protocol === 'file:')
};
var Request = (function () {
    function Request(_method, _url) {
        this._method = _method;
        this._url = _url;
        this._xhr = utilities_1.ajax();
    }
    Request.prototype.send = function (data) {
        this._data = data;
        return this;
    };
    Request.prototype.withCredentials = function (ret) {
        this._xhr.withCredentials = ret;
        return this;
    };
    Request.prototype.end = function (data) {
        var _this = this;
        this._data = data || this._data;
        var defer = deferred();
        this._xhr.addEventListener('readystatechange', function () {
            if (_this._xhr.readyState !== XMLHttpRequest.DONE)
                return;
            if (!isValid(_this._xhr, _this._url)) {
                return defer.reject(new Error('server responded with: ' + _this._xhr.status));
            }
            defer.resolve(_this._xhr.responseText);
        });
        this._xhr.open(this._method, this._url, true);
        this._xhr.send(this._data);
        return defer.promise;
    };
    Request.prototype.json = function (data) {
        var _this = this;
        return this.end(data)
            .then(function (str) {
            var accepts = _this._xhr.getResponseHeader('content-type');
            if (jsonRe.test(accepts) && str !== '') {
                var json = JSON.parse(str);
                return json;
            }
            else {
                throw new Error('json');
            }
        });
    };
    Request.prototype.progress = function (fn) {
        this._xhr.addEventListener('progress', fn);
        return this;
    };
    Request.prototype.header = function (field, value) {
        this._xhr.setRequestHeader(field, value);
        return this;
    };
    return Request;
})();
exports.Request = Request;
var request;
(function (request) {
    function get(url) {
        return new Request('GET', url);
    }
    request.get = get;
    function post(url) {
        return new Request('POST', url);
    }
    request.post = post;
    function put(url) {
        return new Request('PUT', url);
    }
    request.put = put;
    function del(url) {
        return new Request('DELETE', url);
    }
    request.del = del;
})(request = exports.request || (exports.request = {}));
