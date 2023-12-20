import { pushToProp } from "./OBJ";
import is from "./is";
import { toCamel } from "./STRING";
import { format } from "date-fns";

const groupType = {
  letter: (o, prop) => o[prop][0].toUpperCase(),
  day: (o, prop) => format(o[prop], "YYYY-MM-DD"),
  string: (o, prop) => o[prop],
};

// groups an array of objects
export function groupBy(arr, prop, type) {
  const groupsObj = {},
    groupsArr = [];
  arr.forEach((o) => {
    let key = groupType[type](o, prop);
    groupsObj[key] = groupsObj[key] || [];
    groupsObj[key].push(o);
  });
  for (let key in groupsObj) {
    groupsArr.push({ key, data: sort(groupsObj[key], prop, { type: String }) });
  }
  sort(groupsArr, "key", { type: String });
  return groupsArr;
}

/**
 * Group items from an array of objects together by some criteria or value.
 * (c) 2019 Tom Bremmer (https://tbremer.com/) and Chris Ferdinandi (https://gomakethings.com), MIT License,
 * @param  {Array}           arr      The array to group items from
 * @param  {String|Function} criteria The criteria to group by
 * @return {Object}                   The grouped object
 */
export function group(arr, criteria) {
  return arr.reduce((obj, item) => {
    let key = is.function(criteria) ? criteria(item) : item[criteria];
    pushToProp(obj, key, item);
    return obj;
  }, {});
}

export const pick = (obj, keys) =>
  keys.reduce((a, k) => {
    a[k] = obj[k];
    return a;
  }, {});

/**
 * Filters an array of objects
 * @param {*} arr The array of objects
 * @param {*} filters An object describing the filters per object property
 * @returns {Array} elements that match the filters
 */
export function filter(arr, filters) {
  if (filters)
    for (let prop in filters) {
      let val = filters[prop];
      if (is.array(val)) {
        arr = arr.filter((item) => val.includes(item[prop]));
      } else {
        arr = arr.filter((item) => item[prop] == val);
      }
      if (!arr.length) break;
    }
  return arr;
}

export function sort(arr, prop, type, desc) {
  arr.sort(
    type == Number
      ? (a, b) => a[prop] - b[prop]
      : (a, b) => (a[prop].toLowerCase() >= b[prop].toLowerCase() ? 1 : -1)
  );
  if (desc) arr.reverse();
  return arr;
}

export function createMap(list, key = "id") {
  if (!is.array(list)) list = Object.values(list);
  const obj = {};
  if (is.object(list[0])) list.forEach((item) => (obj[item[key]] = item));
  else list.forEach((item) => (obj[toCamel(item)] = item));
  return obj;
}

export function bringToFront(list, item, key = "id") {
  if (!item) return;
  if (!is.array(list)) list = Object.values(list);
  if (item == list[0]) return;
  let id = item[key];
  list.sort((x, y) => (x[key] == id ? -1 : y[key] == id ? 1 : 0));
  return list;
}
