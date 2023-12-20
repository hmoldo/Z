import { expect, describe, it } from "vitest";
import * as data from "/src/DATA";

let o1 = { a: 1, b: 2, c: 3, d: 4, e: 5 },
  o2 = { a: 5, b: 4, c: 3, d: 2, e: 1 },
  o3 = { a: 1, b: 1, c: 1, d: 1, e: 5 },
  arr1 = [o1, o2, o3],
  o4 = { a: "b", b: 2, c: new Date(1995, 11, 17) },
  o5 = { a: "0", b: 1, c: new Date(1995, 11, 12) },
  o6 = { a: "a", b: 3, c: new Date(2000, 11, 17) },
  arr2 = [o4, o5, o6];

describe("Data (array of objects) utils", () => {
  it("Group items from an array of objects together by some criteria or value", () => {
    expect(data.group(arr1, "a")).toEqual({
      1: [o1, o3],
      5: [o2],
    });
    expect(data.group(arr1, (o) => o.b + o.d)).toEqual({
      6: [o1, o2],
      2: [o3],
    });
  });

  it("Creates map of objects based on key", () => {
    expect(data.createMap([o1, o2, o3], "b")).toEqual({ 2: o1, 4: o2, 1: o3 });
    expect(data.createMap(["a-test-1", "a-test-2", "a-test-3"], "b")).toEqual({
      aTest1: "a-test-1",
      aTest2: "a-test-2",
      aTest3: "a-test-3",
    });
    expect(data.createMap(o1)).toEqual(o1);
    expect(data.createMap("test")).toBe("test");
  });
});
