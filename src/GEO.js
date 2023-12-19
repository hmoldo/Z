export function getCountryFromCode(code, lang = ['en']) {
    try {
        return code ? new Intl.DisplayNames(lang, { type: 'region' }).of(code) : null;
    } catch (e) {
        return null;
    }
}

export function point({ id, lnglat, title, properties }) {
    return {
        type: 'Feature',
        id,
        geometry: { type: 'Point', coordinates: lnglat },
        properties: Object.assign({ id, title }, properties),
    };
}

export function line({ id, points, stroke, dash }) {
    return {
        type: 'Feature',
        id,
        bounds: getBounds(points),
        properties: { stroke, dash },
        geometry: { type: 'LineString', coordinates: points },
    };
}

export function getBounds(points) {
    var n = points?.length;
    if (!n) return [];
    let d = points[0].length,
        lo = points[0].slice(),
        hi = points[0].slice();
    for (let i = 1; i < n; ++i) {
        let p = points[i];
        if (!p?.length) continue;
        for (let j = 0; j < d; ++j) {
            let x = p[j];
            lo[j] = Math.min(lo[j], x);
            hi[j] = Math.max(hi[j], x);
        }
    }
    return [lo, hi];
}
