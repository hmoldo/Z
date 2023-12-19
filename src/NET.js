import { removeNulls } from './OBJ';
const W = window;

export async function load(o) {
    const { url, options, timeout, auth, type } = parseLoadOptions(o);
    let resp, body;
    const { fetchPromise } = fetchWithTimeout(url, options, timeout);
    try {
        resp = await fetchPromise;
    } catch (e) {
        console.error(e);
    }
    try {
        body = await resp[type]();
    } catch (e) {
        // continue
    }
    return { resp, body, auth };
}

export function loadPromise(o) {
    const { url, options, timeout } = parseLoadOptions(o);
    return fetchWithTimeout(url, options, timeout);
}

function parseLoadOptions({ url, auth, payload, params, options, type = 'json', timeout }) {
    options ??= {};
    options.headers ??= {};

    // auth
    if (auth) {
        let { token, base64, key, tokenCode, username, password } = auth;
        if (token && base64) key ??= 'AppToken';
        else key = tokenCode ? key ?? 'AppToken' : null;
        base64 = base64 || W.btoa(tokenCode || username + ':' + password);
        if (base64) {
            auth.base64 = base64;
            key ??= 'Basic';
            options.headers.Authorization = base64 ? key + ' ' + base64 : null;
        }
    }

    // payload
    if (payload) {
        let { data, body, formData } = payload;
        if (body || formData) body = body ? Z.obj.toFormdata(body) : formData;
        body ??= JSON.stringify(data);
        if (data) options.headers['Content-Type'] = 'application/json';
        if (body) {
            options.method ??= 'post';
            options.body = body;
        }
    }

    // response type
    if (type == 'json') {
        options.headers['Accept'] = 'application/json';
    }

    // url & params
    removeNulls(params);
    url = createURL(url, params);
    return { url, options, timeout, auth, type };
}

/**
 * Request a raw content from endpoint
 * @param {String} url - Endpoint url
 * @returns String if ok, response object otherwise
 */
export async function loadRaw(url) {
    let { body } = await load({ url, type: 'text' });
    return body;
}

/**
 * Loads a script to current document
 * @param {String} url - url of js resource
 * @param {Function} done - callback to execute on load
 */
export function loadScript(url, done) {
    let $el = $('<script type="module" src="' + url + '">');
    $el.on('load', done);
    $el.appendTo('head');
}

/**
 * Loads a css to current document
 * @param {String} url - url of css resource
 */
export function loadCSS(url) {
    let $el = $('<link rel="stylesheet" type="text/css" href="' + url + '">');
    $el.appendTo('head');
}

/**
 * Creates url with parameters
 * If not absolute url then uses current site origin
 * Throws away null params
 * @param {String} url - Endpoint url
 * @param {Object} params - Url params { param: value }
 * @returns {String} The final url
 */
function createURL(url, params) {
    url = url.startsWith('http') ? url : W.origin + url;
    url = new URL(url);
    if (params)
        for (let key in params) {
            if (params[key] !== null) url.searchParams.append(key, params[key]);
        }
    return url;
}

/**
 * Fetch from url with a timeout
 * Mostly a helper for other functions.
 * @param {String} url - Endpoint url
 * @param {Object} options - fetch options
 * @returns Response object
 */
export function fetchWithTimeout(url, options = {}, timeout = 200000) {
    const aborter = new AbortController(),
        abortTimer = setTimeout(() => aborter.abort(), timeout),
        fetchPromise = fetch(url, { ...options, signal: aborter.signal });
    fetchPromise.then(() => clearTimeout(abortTimer)).catch(e => console.log(e));
    return { fetchPromise, aborter };
}

export const call = phone => (W.location.href = 'tel:' + phone);
export const whatsapp = phone => W.open('https://wa.me/' + (phone ?? ''), 'whatsapp');
export const nav = url => W.open(url);

export function email(o) {
    let to = o.to ?? '',
        params = '';
    for (let k in o) if (k != 'to') params += '&' + k + '=' + o[k];
    if (params.length) params = '?' + params;
    window.open('mailto:' + to + params);
}

export function download(name, content, type) {
    try {
        let el = document.createElement('a');
        el.href = Z.mime.get(type) + content;
        el.download = name;
        el.target = '_blank';
        el.click();
    } catch (e) {
        console.error(e);
    }
}

export function getMapURL(name, address, lat, long) {
    if (lat == null || long == null) return;
    let iosURL = mapURL.apple({ lat, long }),
        googleMapsURL = mapURL.google({ name, address, lat, long });
    return Z.is.appleMobile ? iosURL : googleMapsURL;
}

export function getMapURLs(
    maps = {
        apple: 'Apple Maps',
        google: 'Google Maps',
    },
    o
) {
    if (o.lat == null || o.long == null) return;
    return Object.keys(maps).reduce((obj, mapID) => {
        if ((Z.is.appleMobile || mapID != 'apple') && mapURL[mapID]) {
            obj[mapID] = {
                label: maps[mapID],
                url: mapURL[mapID](o),
            };
        }
        return obj;
    }, {});
}

/**
 * From an array of objects load an img url prop
 * and set widths & heights
 * @param {Object} options Options
 * @param {Array} options.items Array of objects
 * @param {String} options.prop Property name that holds the image url
 * @param {Function} options.onload Functions to execute when all images loaded
 */
export function getImgsMeta({ items, prop, onload }) {
    let loaded = 0;
    items.forEach(item => {
        getImgMeta(
            item[prop],
            (width, height) => {
                Object.assign(item, { width, height });
                if (++loaded == items.length && onload) onload();
            },
            () => {
                if (++loaded == items.length && onload) onload();
            }
        );
    });
}

export function getImgMeta(url, fn, er) {
    const img = new Image();
    console.log(url);
    img.addEventListener('load', function () {
        fn(this.naturalWidth, this.naturalHeight);
    });
    img.addEventListener('error', er);
    img.src = url;
}

const URLs = {
    googleMaps: 'https://www.google.com/maps/search',
    waze: 'https://waze.com/ul',
};

const mapURL = {
    apple: o => 'maps://?q=' + o.lat + ',' + o.long,
    // https://developers.google.com/maps/documentation/urls/get-started#map-action
    google: o => {
        // let query = o.lat + '%2C' + o.long;
        let query = encodeURIComponent(o.name + ', ' + o.address);
        return URLs.googleMaps + '/?api=1&query=' + query;
    },
    waze: o => URLs.waze + '?ll=' + o.lat + '%2C' + o.long,
};
