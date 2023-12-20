// String ----------------------------------------------------------------------------
export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.substring(1);

// Hyphanated to camel case
export const toCamel = (s) =>
  s.replace(/([-_][a-z0-9])/gi, ($1) =>
    $1.toUpperCase().replace("-", "").replace("_", "")
  );
// Decamelizes a string with/without a custom separator (dash by default).
export const decamelize = (str, separator = "-") =>
  str
    .replace(/([a-z\d])([A-Z])/g, "$1" + separator + "$2")
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + separator + "$2")
    .toLowerCase();

export const getFirstMatch = (str, reg) => (str.match(reg) || []).shift();
export const getFirstChar = (str) =>
  str ? t.getFirstMatch(str, /[A-Za-z]/g) || "" : "";
export const splitCommas = (str) => str.split(/[\s,]+/);

export const int = (str) => (str ? parseInt(str.match(/\d+/g)[0]) : 0);
export function getInt(num) {
  let n = parseInt(num, 10);
  return isNaN(n) ? 0 : n;
}

export function addBrackets(str, count = 1) {
  let exist = str.match(/(^\[*)/)[0].length;
  for (let i = 0; i < count - exist; i++) str = "[" + str + "]";
  return str;
}

// get last part of string after char
export function getLastPartAfter(str, ch) {
  let arr = str.split(ch);
  return arr[arr.length - 1];
}

export const htmlEntities = {
  // Converts a string to its html characters completely.
  encode: (str) => {
    var buf = [];
    for (var i = str.length - 1; i >= 0; i--) {
      buf.unshift(["&#", str[i].charCodeAt(), ";"].join(""));
    }

    return buf.join("");
  },
  // Converts an html characterSet into its original character.
  decode: (str) =>
    str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)),
};

export function removeOuterTags(str) {
  str = t.unescapeHTML(str);
  if (str[0] == "<" && str[str.length - 1] == ">") {
    let p = str.indexOf(">") + 1;
    str = str.substr(p);
    p = str.lastIndexOf("<");
    str = str.substr(0, p);
  }
  return str;
}

export const unescapeHTML = (escapedHTML) =>
  escapedHTML
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

export const query = (query, str) =>
  str.toLowerCase().includes(query.toLowerCase());
export const mark = (str, mark, marker = "mark") =>
  str
    .toLowerCase()
    .replace(
      new RegExp(mark, "g"),
      "<" + marker + ">" + mark + "</" + marker + ">"
    );

export function markOn({ str, start, length, trim }) {
  let zero = trim >= 0 ? start - trim : 0,
    fin = trim >= 0 ? start + length + trim : 10000;
  str = str.replace(/<[^>]*>/g, "");
  return (
    (zero > 0 ? ".." : "") +
    str.substring(zero, start) +
    "<mark>" +
    str.substring(start, start + length) +
    "</mark>" +
    str.substring(start + length, fin) +
    (fin < str.length ? ".." : "")
  );
}

export const slugify = (str, separator = "-") =>
  str
    .toString()
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, separator);

export const join = (strArray, glue = " ") =>
  strArray.filter((str) => str?.length).join(glue);
export function trim(str, c) {
  if (c === "]") c = "\\]";
  if (c === "\\") c = "\\\\";
  return str.replace(new RegExp("^[" + c + "]+|[" + c + "]+$", "g"), "");
}
export const getNameFromPath = (path) =>
  path
    .split("/")
    .pop()
    .replace(/\.\w+$/, "");

export const env = (v) =>
  v == "true" ? true : v == "false" ? false : v == "null" ? null : v;

export const plural = (msgObj, count, replaces = { count }) => {
  let msg = msgObj[count] || msgObj.other;
  for (let key in replaces) msg = msg.replace(`{${key}}`, replaces[key]);
  return msg;
};
export const insertStrAt = (str, pos, insert) =>
  str.substr(0, pos) + insert + str.substr(pos);
