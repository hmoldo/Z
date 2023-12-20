import { expect, test } from "vitest";
import * as obj from "/src/OBJ";

let o1 = { a: 1, b: 2, c: 3, d: 4, e: 5 },
  o2 = { a: 5, b: 4, c: 3, d: 2, e: 1 },
  o3 = { a: 1, b: 1, c: 1, d: 1, e: 5 },
  arr1 = [o1, o2, o3],
  o4 = { a: "b", b: 2, c: new Date(1995, 11, 17) },
  o5 = { a: "0", b: 1, c: new Date(1995, 11, 12) },
  o6 = { a: "a", b: 3, c: new Date(2000, 11, 17) },
  arr2 = [o4, o5, o6];

test("Creates array from object properties", () => {
  expect(
    obj.props2Array({ a: 1, b: 2, c: 3, d: 4, e: 5 }, ["a", "c", "e"])
  ).toEqual([1, 3, 5]);
  expect(
    obj.props2Array({ a: 5, b: 4, c: 3, d: 2, e: 1 }, ["a", "c", "e"])
  ).toEqual([5, 3, 1]);
  expect(obj.props2Array({ a: 1, b: 1, c: 1, d: 1, e: 5 }, ["b", "d"])).toEqual(
    [1, 1]
  );
});

test("Joins object properties using a glue", () => {
  expect(obj.joinProps({ a: 1, b: 2, c: 3, d: 4, e: 5 }, ["a", "c", "e"])).toBe(
    "1,3,5"
  );
});

test("Pushes & removes items to object property of array type", () => {
  let o = {};
  obj.pushToProp(o, "test", 0);
  expect(o).toEqual({ test: [0] });
  obj.pushToProp(o, "test", 1, 2, 3);
  expect(o).toEqual({ test: [0, 1, 2, 3] });
  obj.removeFromProp(o, "test", 1, 2);
  expect(o).toEqual({ test: [0, 3] });
  obj.removeFromProp(o, "test", 0, 4);
  expect(o).toEqual({ test: [3] });
  obj.removeFromProp(o, "test", 3, 5);
  expect(o).toEqual({});
});

test("Creates a new object by picking an object properties", () => {
  expect(obj.pick(o1, ["a", "c", "e"])).toEqual({ a: 1, c: 3, e: 5 });
});

test("Picks properties from a source & assign them to target", () => {
  let o = { a: 5, b: 4, c: 3, d: 2 };
  expect(obj.assignProps(o, { a: 1, e: 5 }, ["a", "c", "e"])).toBeTruthy();
  expect(o).toEqual({ a: 1, b: 4, c: 3, d: 2, e: 5 });
  obj.assignProps(o, { a: 1, e: 5 }, ["a", "c", "e"]);
  expect(o).toEqual({ a: 1, b: 4, c: 3, d: 2, e: 5 });
});

test("Get a property and assign value if is not defined", () => {
  expect(obj.getKey(o1, "c", 8)).toBe(3);
  expect(obj.getKey(o1, "f", 8)).toBe(8);
  expect(o1).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 8 });
});

test("Selects properties from an object to a new object if is not in default", () => {
  const o = { a: 1, b: 2, c: 3, d: 4, e: 5 },
    defaults = { a: 3, b: 2, e: 5 };
  expect(obj.getDifferent(o, defaults)).toEqual({
    a: 1,
    c: 3,
    d: 4,
  });
  expect(obj.getDifferent(o)).toEqual(o);
});

test("Runs a function to all Object keys & assigns the result", () => {
  let o1 = { a: 1, b: 2, c: 3, d: 4, e: 5 };
  expect(obj.objMap(o1, (i) => i + "a")).toEqual({
    a: "aa",
    b: "ba",
    c: "ca",
    d: "da",
    e: "ea",
  });
});

test("Removes null properties", () => {
  let a = { a: 1, b: null, c: 3, d: 0, e: 4 };
  obj.removeNulls(a);
  expect(a).toEqual({ a: 1, c: 3, d: 0, e: 4 });
});

test("Removes array duplicates objects base on id", () => {
  let a1 = { id: 1 },
    a2 = { id: 2 },
    a3 = { id: 1 },
    a4 = { id: 3 },
    a5 = { id: 1 };
  expect(obj.uniqueIDs([a1, a2, a3, a4, a5])).toEqual([a1, a2, a4]);
});

test("Destroys and deletes property from object", () => {
  let x = 0,
    o1 = { a: 1, b: { x: 8, destroy: () => (x = 1) }, c: 3 };
  o2 = { a: 1 };
  obj.destroyKey(o1, "b");
  expect(o1.b).toBeUndefined();
  expect(x).toBe(1);
  obj.destroyKey(o2, "b");
  expect(o2).toEqual({ a: 1 });
});

test("Swaps object keys-values", () => {
  let o = { a: 1, b: 2, 3: "c" };
  expect(obj.swap(o)).toEqual({ 1: "a", 2: "b", c: "3" });
});
test("Selects a breakpoint value from a breakpoint object", () => {
  // A breakpoint object:
  let o = { 0: 1, 540: 2, 768: 3, 1920: 4 };
  expect(obj.breakpoint(o, 1000)).toBe(3);
  expect(obj.breakpoint(o, 2000)).toBe(4);
  expect(obj.breakpoint(o, 540)).toBe(2);
  expect(obj.breakpoint(o, 400)).toBe(1);
  expect(obj.breakpoint(o, -2)).toBe(1);
});
