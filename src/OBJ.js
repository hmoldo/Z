import { remove, maxOfLows } from "./ARRAY";
import is from "./is";

/**
 * From specific keys of an object get the value in an array
 * @param {Object} obj The object to get the values
 * @param {Array} keys Array of key names to get
 * @returns {Array} The values of the keys
 */
export const props2Array = (obj, keys) =>
  keys.reduce((a, k) => a.concat(obj[k]), []);

export const joinProps = (obj, keys, glue = ",") =>
  props2Array(obj, keys).join(glue);

// push an item in an object property of type array
// creates the property if doesn't exists
export function pushToProp(obj, key, ...items) {
  obj[key] || (obj[key] = []);
  items.forEach((item) => obj[key].push(item));
}

/**
 * Removes an item in an object property of type array. Deletes the property if is empty.
 * @param {Object} obj Object
 * @param {String} key Property name
 * @param  {...any} items Items to remove
 */
export function removeFromProp(obj, key, ...items) {
  let arr = obj[key];
  remove(arr, (s) => items.includes(s));
  if (!arr.length) delete obj[key];
}

export const flatten = (obj) => {
  let result = {};

  for (const i in obj) {
    if (is.object(obj[i])) {
      const temp = flatten(obj[i]);
      for (const j in temp) result[j] = result[j] || temp[j];
    } else {
      result[i] = obj[i];
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
  keys.forEach((k) => {
    if (!has(source, k) || target[k] == source[k]) return;
    target[k] = source[k];
    changed = true;
  });
  return changed;
}

export const getKey = (obj, key, val) =>
  has(obj, key) ? obj[key] : (obj[key] = val);

// Like Object.assign but filter outs nullish
export function getProps(obj, keys) {
  return keys.reduce((a, k) => {
    if (obj[k]) a[k] = obj[k];
    return a;
  }, {});
}

export function pick(obj, keys) {
  return keys.reduce((a, k) => {
    a[k] = obj[k];
    return a;
  }, {});
}

/**
 * Renames a key in an object
 * @param {Object} The object that its key will be renamed
 * @param {String} key The original key name
 * @param {String} newName The new name
 * @returns
 */
export function renameProp(obj, key, newName) {
  if (!has(obj, key)) return;
  obj[newName] = obj[key];
  delete obj[key];
}

/**
 * Renames multiple keys in all objects in an array
 * @param {Array} list The array of the objects to rename their keys
 * @param {Object} renames An object with old names as keys and new names as values
 */
export function renameProps(list, renames) {
  list.forEach((item) => {
    for (let oldName in renames) {
      renameProp(item, oldName, renames[oldName]);
    }
  });
}

export function objMap(obj, f) {
  for (let k in obj) obj[k] = f(k);
  return obj;
}

export function arr2obj(arr, prop = "id") {
  if (!is.array(arr)) return arr;
  let obj = {};
  if (is.object(arr[0])) arr.forEach((item) => (obj[item[prop]] = item));
  else arr.forEach((item) => (obj[Z.toCamel(item)] = item));
  return obj;
}

export function removeNulls(obj) {
  for (let k in obj) if (!obj[k] && obj[k] !== 0) delete obj[k];
}

// remove duplicates from array of objects based on id property
export function uniqueIDs(arr, key = "id") {
  return arr.reduce(
    (a, c) => (a.find((i) => i[key] === c[key]) ? a : a.concat([c])),
    []
  );
}

export function objConcatProps(objs, prop, unique = true) {
  prop = Array.isArray(prop) ? prop : [prop];
  let arr = objs.reduce((a, i) => {
    let values = prop.reduce((b, p) => (i[p] ? i[p].concat(b) : b), []);
    return values.concat(a);
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

export const vals = (obj) => (is.array(obj) ? obj : Object.values(obj));

/**
 * Check if has at least one key
 * @param {*} obj
 * @returns {Boolean} True if key length greater than zero
 */
export const hasKeys = (obj) => obj && Object.keys(obj).length;

export const isEmpty = (obj) => is.object(obj) && !Object.keys(obj).length;

export const ifValues = (obj) =>
  Object.values(obj).filter((v) => v).length ? obj : null;

// Merge a `source` object to a `target` recursively
export const merge = (target, source) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    let val = source[key];
    if (is.object(val)) Object.assign(val, merge(target[key], val));
  }

  // Join `target` and modified `source`
  return Object.assign(target || {}, source);
};

export function getFirstKeyOf(obj, keyArray) {
  const key = keyArray.find((key) => has(obj, key));
  return key || Object.keys(obj)[0];
}

export const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * Creates an array from an object including keys as a property named id
 * @param {Object} obj The object to transform
 * @returns {Array} An array with object values with the key as id property
 */
export function addIDs(obj) {
  const values = [];
  if (obj)
    $.each(obj, (id, v) =>
      values.push(Object.assign({ id: isNaN(id) ? id : parseInt(id) }, v))
    );
  return values;
}

export const intKeys = (obj) => Object.keys(obj).map((key) => parseInt(key));

export function sortKeys(obj, keys) {
  const sorted = getProps(obj, keys);
  for (let key in obj) {
    if (!keys.includes(key)) sorted[key] = obj[key];
  }
  return sorted;
}

/**
 * Swaps keys, values of an object.
 * @param {Object} obj The object to swap
 * @returns {Object} The swapped object
 */
export function swap(obj) {
  const ret = {};
  for (let key in obj) ret[obj[key]] = key;
  return ret;
}

/**
 * Selects properties from an object and creates a new Object.
 * If a property exist in defaults with the same value it skipped.
 * @param {Object} source
 * @param {Object} defaults
 * @returns {Object}
 */
export function getDifferent(source, defaults = {}) {
  const target = {};
  for (let key in source) {
    let value = source[key];
    if (defaults[key] != value) target[key] = value;
  }
  return target;
}

/**
 * Utility method to call a property destroy method before delete it
 * @param {Object} o The object that has the property
 * @param {String} p The property name
 */
export function destroyKey(o, key) {
  if (!o.hasOwnProperty(key)) return;
  o[key].destroy();
  delete o[key];
}

/**
 *
 * @param {Object} points A breakpoint object: {0: x, 360: y, 649: z ... }
 * @param {Number} x The number to resolve
 * @returns {*} Value of the resolved property
 */
export const breakpoint = (points, x) => points[maxOfLows(intKeys(points), x)];
