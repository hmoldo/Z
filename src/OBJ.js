export const props2Array = (obj, keys) => keys.reduce((a, k) => a.concat(obj[k]), []);

export const joinProps = (obj, keys, glue = ',') => props2Array(obj, keys).join(glue);

// push an item in an object property of type array
// creates the property if doesn't exists
export function pushToProp(obj, key, ...items) {
    obj[key] || (obj[key] = []);
    items.forEach(item => obj[key].push(item));
}

export const flatten = ob => {
    let result = {};

    for (const i in ob) {
        if (Z.is.object(ob[i])) {
            const temp = flatten(ob[i]);
            for (const j in temp) result[j] = result[j] || temp[j];
        } else {
            result[i] = ob[i];
        }
    }
    return result;
};

/**
 * Picks & assign props to an object
 * @param {Object} target Object to assign props
 * @param {Object} source Object to pick props
 * @param {Array} propNames Prop names to pick
 * @returns boolean
 */
export function assignProps(target, source, keys) {
    if (!source) return false;
    let changed = false;
    keys.forEach(k => {
        if (!has(source, k) || target[k] == source[k]) return;
        target[k] = source[k];
        changed = true;
    });
    return changed;
}

export const getKey = (obj, key, val) => (has(obj, key) ? obj[key] : (obj[key] = val));

// Like Object.assign but filter outs nulls
export function getProps(obj, keys) {
    return keys.reduce((a, k) => {
        if (obj[k]) a[k] = obj[k];
        return a;
    }, {});
}

export function selectProps(obj, keys) {
    return keys.reduce((a, k) => {
        a[k] = obj[k];
        return a;
    }, {});
}

export function renameProp(obj, key, newName) {
    if (!has(obj, key)) return;
    obj[newName] = obj[key];
    delete obj[key];
}
export function renameProps(list, renames) {
    list.forEach(item => {
        for (let oldName in renames) {
            Z.renameProp(item, oldName, renames[oldName]);
        }
    });
}

export function objMap(obj, f) {
    for (let k in obj) obj[k] = f(k);
    return obj;
}

export function arr2obj(arr, prop = 'id') {
    if (!Z.is.array(arr)) return arr;
    let obj = {};
    if (Z.is.object(arr[0])) arr.forEach(item => (obj[item[prop]] = item));
    else arr.forEach(item => (obj[Z.toCamel(item)] = item));
    return obj;
}

export function removeNulls(obj) {
    for (let k in obj) if (!obj[k] && obj[k] !== 0) delete obj[k];
}

// remove duplicates from array of objects based on id property
export function uniqueIDs(arr, key = 'id') {
    return arr.reduce((a, c) => (a.find(i => i[key] === c[key]) ? a : a.concat([c])), []);
}

export function objConcatProps(objs, prop, unique = true) {
    prop = Array.isArray(prop) ? prop : [prop];
    let arr = objs.reduce((a, i) => {
        let vals = prop.reduce((b, p) => (i[p] ? i[p].concat(b) : b), []);
        return vals.concat(a);
    }, []);
    return unique ? Z.unique(arr) : arr;
}

export function toFormdata(obj) {
    let formData = new FormData();
    for (let key in obj) formData.append(key, obj[key]);
    return formData;
}

export function serializeForm(formData) {
    var obj = {};
    for (var key of formData.keys()) obj[key] = formData.get(key);
    return obj;
}

export const vals = obj => (Z.is.array(obj) ? obj : Object.values(obj));

export const hasKeys = obj => obj && Object.keys(obj).length;
export const isEmpty = obj => Z.is.object(obj) && !Object.keys(obj).length;
export const ifValues = obj => (Object.values(obj).filter(v => v).length ? obj : null);

// Merge a `source` object to a `target` recursively
export const merge = (target, source) => {
    // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
    for (const key of Object.keys(source)) {
        let val = source[key];
        if (Z.is.object(val)) Object.assign(val, merge(target[key], val));
    }

    // Join `target` and modified `source`
    return Object.assign(target || {}, source);
};

export function getFirstKeyOf(obj, keyArray) {
    let key = keyArray.find(key => has(obj, key));
    return key || Object.keys(obj)[0];
}

export const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * Creates an array from an object incuding keys as a property named id
 * @param {Object} obj The object to transform
 * @returns {Array} An array with object values with the key as id property
 */
export function addIDs(obj) {
    let vals = [];
    if (obj) $.each(obj, (id, v) => vals.push(Object.assign({ id: isNaN(id) ? id : parseInt(id) }, v)));
    return vals;
}

export const intKeys = obj => Object.keys(obj).map(key => parseInt(key));

export function sortKeys(obj, keys) {
    let sorted = getProps(obj, keys);
    for (let key in obj) {
        if (!keys.includes(key)) sorted[key] = obj[key];
    }
    return sorted;
}
