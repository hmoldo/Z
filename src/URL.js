export const param = query => new URLSearchParams(Object.entries(query));
export const goToUrl = (url, target) => (target == '_self' ? (window.location = url) : window.open(url, target));

export function parseParams(str) {
    // parse query string
    const url = new URL(str || window.location.href),
        params = new URLSearchParams(url.search),
        obj = {};

    // iterate over all keys
    for (const key of params.keys()) {
        let arr = params.getAll(key);
        obj[key] = arr.length > 1 ? arr : params.get(key);
    }
    return obj;
}

export const getUrlParam = param => parseParams()[param];

export function serializeObj(obj) {
    var str = [];
    for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
    return str.join('&');
}

export function obj2params(obj) {
    if (!obj) return '';
    let str = serializeObj(obj);
    return str && str.length ? '?' + str : '';
}

export const setParams = params =>
    window.location.pathname + '?' + serializeObj(Object.assign(Z.url.parseParams(), params));

export function setUrlParams(params) {
    if (!history.pushState) return;
    Z.removeNullProps(params);
    let paramStr = serializeObj(params);
    if (paramStr && paramStr.length) paramStr = '?' + paramStr;
    let { protocol, host, pathname } = window.location,
        newurl = protocol + '//' + host + pathname + paramStr;
    window.history.pushState({ path: newurl }, '', newurl);
}
export const getDomain = url => url.replace('http://', '').replace('https://', '').split('/')[0];
export const addHttps = url => (url && !url.startsWith('http') ? 'https://' + url : url);
export const removeDomain = url => url.replace(Z.baseURL, '');
export function isExternal(url) {
    let domain = getDomain(url);
    return domain !== '' && domain !== getDomain(location.href);
}

export function lastPath(url) {
    if (!url && window) url = window.location.pathname;
    return url.substring(url.lastIndexOf('/') + 1);
}
