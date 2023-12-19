export const rand = (min, max) => min + Math.random() * (max - min);
export const randInt = (min, max) => Math.floor(rand(min, max + 1));
export const clamp = (number, min = 0, max = 1) => Math.max(min, Math.min(number, max));

export function lerp(x, o) {
    let { start, end, min, max } = o;
    return x <= start ? min : x >= end ? max : min + ((x - start) / (end - start)) * (max - min);
}

export const contain = (w, h, ratio = 1) => {
    const isY = w / h > ratio;
    const rect = isY
        ? { y: 0, height: h, width: h * ratio, x: (w - h * ratio) / 2 }
        : { x: 0, width: w, height: w / ratio, y: (h - w / ratio) / 2 };
    rect.scale = isY > ratio ? rect.height / h : rect.width / w;
    return rect;
};
export function cover(w, h, ratio = 1) {
    const isY = w / h > ratio;
    const rect = isY
        ? { x: 0, width: w, height: w / ratio, y: (h - w / ratio) / 2, isY }
        : { y: 0, height: h, width: h * ratio, x: (w - h * ratio) / 2, isY };
    rect.scale = isY > ratio ? rect.height / h : rect.width / w;
    return rect;
}

// returns transformation of r2 to be contained inside r1
export const containRect = ({ x = 0, y = 0, width, height }, r2) => {
    let ar1 = width / height,
        ar2 = r2.width / r2.height;
    const C =
        ar2 > ar1
            ? { width, height: width / ar2, scale: width / r2.width }
            : { height, width: height * ar2, scale: height / r2.height };
    return Object.assign(C, {
        x: x + (width - r2.width) / 2,
        y: y + (height - r2.height) / 2,
    });
};

export const arrMin = arr => Math.min(...arr);
export const arrMax = arr => Math.max(...arr);
export const arrSum = arr => arr.reduce((a, b) => a + b);
export const arrAvg = arr => Z.arrSum(arr) / arr.length;

export function getBounds(val, arr) {
    let o = {},
        i = arr.findIndex(v => v > val);
    if (i) o.bottom = i > 0 ? arr[i - 1] : arr[arr.length - 1];
    if (i >= 0) o.top = arr[i];
    return o;
}

export function getCenter(points) {
    let area = 0;
    let i, j, point1, point2;

    for (i = 0, j = points.length - 1; i < points.length; j = i, i++) {
        point1 = this.points[i];
        point2 = this.points[j];
        area += point1.x * point2.y;
        area -= point1.y * point2.x;
    }
    area /= 2;
    return area;
}

export const dist = (p0, p1) => Math.sqrt((p1.x - p0.x) * (p1.x - p0.x) + (p1.y - p0.y) * (p1.y - p0.y));

// returns a point on a single line (two points) using distance // line=[[x0,y0],[x1,y1]]
export const pntOnLine = (p0, p1, t) => ({ x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t });

export const decimals = (num, decimals) => (isNaN(num) ? null : (Math.round(num * 100) / 100).toFixed(decimals));
