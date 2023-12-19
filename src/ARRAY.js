// Array ------------------------------------------------------------------------------
const t = {
    unique: arr => [...new Set(arr)],

    sort(arr, type, desc) {
        arr.sort(type == Number ? (a, b) => a - b : (a, b) => (a.toLowerCase() >= b.toLowerCase() ? 1 : -1));
        if (desc) arr.reverse();
        return arr;
    },

    getLast: arr => arr[arr.length - 1],
    cycle: (arr, i) => arr[i < 0 ? arr.length - 1 : i >= arr.length ? 0 : i],
    cycleTo: (arr, find, step) => t.cycle(arr, arr.findIndex(find) + step),

    inc: (arr, i) => (i >= arr.length - 1 ? 0 : i + 1),

    /**
     * Removes elements from array & returns the removed elements
     * @param {Array} arr The array from which to remove elements
     * @param {Function} fn Function to check if the element must remove
     * @param {Number} max Max number of elements to removed
     * @param {Number} start Index of array to start removing
     * @returns {Array} all removed elements
     */
    remove(arr, fn, max, start = 0) {
        let found = [],
            idxs = [];
        for (let i = start; i < arr.length; i++) {
            let item = arr[i];
            if ($.isFunction(fn) ? fn(item) : item == fn) {
                found.push(item);
                idxs.push(i);
            }
            if (max && idxs.length >= max) break;
        }
        t.removeIndexes(arr, idxs);
        return found;
    },

    toggle(arr, v) {
        let index = arr.indexOf(v),
            add = index == -1;
        if (add) arr.push(v);
        else arr.splice(index, 1);
        return add;
    },

    removeIndexes(arr, idxs) {
        let k = 0;
        for (let n of idxs) {
            arr.splice(n - k, 1);
            k++;
        }
    },

    removeByVal(arr, v) {
        let index = arr.indexOf(v);
        if (index !== -1) arr.splice(index, 1);
    },

    /**
     * Finds the maximum number of an array which is less or equal from a given number
     * @param {Array} points Array of numbers
     * @param {Number} x The number to track
     * @returns {Number} maximum number in points which is <= x
     */
    maxOfLows(points, x) {
        let lowers = points.filter(p => p <= x);
        return lowers.length ? Math.max(...lowers) : Math.min(...points);
    },

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },
    pick: (arr, n = 1) => Z.arr.shuffle(arr).slice(0, n),
    pushNotExist(arr, obj, key) {
        if (!arr.find(el => el[key] == obj[key])) arr.push(obj);
    },
    slice(arr, start, end) {
        return arr.slice(Math.max(start, 0), Math.min(end, arr.length));
    },
    attach(target, source, val, oldVal) {
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
    },
};

export default t;
