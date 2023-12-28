import is from './is';
// Array ------------------------------------------------------------------------------

export const unique = arr => [...new Set(arr)];

export function sort(arr, type, desc) {
    arr.sort(type == Number ? (a, b) => a - b : (a, b) => (a.toLowerCase() >= b.toLowerCase() ? 1 : -1));
    if (desc) arr.reverse();
    return arr;
}

export const getLast = arr => arr[arr.length - 1];

export const cycle = (arr, i) => arr[i < 0 ? arr.length - 1 : i >= arr.length ? 0 : i];

export const cycleTo = (arr, find, step) => cycle(arr, arr.findIndex(find) + step);

export const inc = (arr, i) => (i >= arr.length - 1 ? 0 : i + 1);

/**
 * Removes elements from array & returns the removed elements
 * @param {Array} arr The array from which to remove elements
 * @param {Function} fn Function to check if the element must remove
 * @param {Number} max Max number of elements to removed
 * @param {Number} start Index of array to start removing
 * @returns {Array} all removed elements
 */
export function remove(arr, fn, max, start = 0) {
    let found = [],
        keys = [];
    for (let i = start; i < arr.length; i++) {
        let item = arr[i];
        if (is.function(fn) ? fn(item) : item == fn) {
            found.push(item);
            keys.push(i);
        }
        if (max && keys.length >= max) break;
    }
    removeIndexes(arr, keys);
    return found;
}

/**
 * Adds a vale to an array if not found or removes it if found.
 * @param {Array} arr The array to search
 * @param {*} value The value to find
 * @returns {Number}
 */
export function toggle(arr, value) {
    let index = arr.indexOf(value),
        add = index == -1;
    if (add) arr.push(value);
    else arr.splice(index, 1);
    return add;
}

export function removeIndexes(arr, idxs) {
    let k = 0;
    for (let n of idxs) {
        arr.splice(n - k, 1);
        k++;
    }
}

export function removeByVal(arr, v) {
    let index = arr.indexOf(v);
    if (index !== -1) arr.splice(index, 1);
}

/**
 * Finds the maximum number of an array which is less or equal from a given number
 * @param {Array} points Array of numbers
 * @param {Number} x The number to track
 * @returns {Number} maximum number in points which is <= x
 */
export function maxOfLows(points, x) {
    let lowers = points.filter(p => p <= x);
    return lowers.length ? Math.max(...lowers) : Math.min(...points);
}

export function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
export const pick = (arr, n = 1) => Z.arr.shuffle(arr).slice(0, n);
export function pushNotExist(arr, obj, key) {
    if (!arr.find(el => el[key] == obj[key])) arr.push(obj);
}
export function slice(arr, start, end) {
    return arr.slice(Math.max(start, 0), Math.min(end, arr.length));
}
export function attach(target, source, val, oldVal) {
    if (val <= oldVal + 1 && val >= oldVal - 1) return;
    let item = source[val];
    if (val > oldVal) {
        target.pop();
        target.push(item);
    } else {
        target.shift();
        target.unshift(item);
    }
    return target;
}
