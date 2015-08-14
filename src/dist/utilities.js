/// <reference path="typings/tsd.d.ts" />
function ajax() {
    var e;
    if (window.hasOwnProperty('XMLHttpRequest')) {
        return new XMLHttpRequest();
    }
    try {
        return new ActiveXObject('msxml2.xmlhttp.6.0');
    }
    catch (_error) {
        e = _error;
    }
    try {
        return new ActiveXObject('msxml2.xmlhttp.3.0');
    }
    catch (_error) {
        e = _error;
    }
    try {
        return new ActiveXObject('msxml2.xmlhttp');
    }
    catch (_error) {
        e = _error;
    }
    return e;
}
exports.ajax = ajax;
;
function truncate(str, length) {
    var n = str.substring(0, Math.min(length, str.length));
    return n + (n.length == str.length ? '' : '...');
}
exports.truncate = truncate;
