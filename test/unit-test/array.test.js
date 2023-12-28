import { expect, describe, it } from "vitest";
import * as array from "/src/ARRAY";

describe("Array utilities", () => {
  it("Return arrays unique value", () => {
    expect(array.unique(["test", 1, 1, 2, "test", false, true, false])).toEqual(
      ["test", 1, 2, false, true]
    );
  });

  it("Sorts array according to type", () => {
    let arrNum = [4, 3, 0, 2, 5, 1];
    let arrStr = ["0", "B", "A", "c", "14", "D", "2"];
    let result = array.sort(arrNum, Number);
    expect(result).toEqual([0, 1, 2, 3, 4, 5]);
    result = array.sort(arrNum, Number, 1);
    expect(result).toEqual([5, 4, 3, 2, 1, 0]);
    result = array.sort(arrStr, String);
    expect(result).toEqual(["0", "14", "2", "A", "B", "c", "D"]);
  });

  it("Gets last element", () => {
    expect(array.getLast([4, 3, 0, 2, 5, 1])).toBe(1);
    expect(array.getLast(["0", "B", "A", "c", "14", "D", "2"])).toBe("2");
  });

  it("Cycle through array jumping to first or last element if out of bounds", () => {
    let arr = [4, 3, 0, 2, 5, 1];
    expect(array.cycle(arr, 0)).toBe(4);
    expect(array.cycle(arr, 5)).toBe(1);
    expect(array.cycle(arr, 3)).toBe(2);
    expect(array.cycle(arr, 6)).toBe(4);
    expect(array.cycle(arr, 10)).toBe(4);
    expect(array.cycle(arr, -1)).toBe(1);
    expect(array.cycle(arr, -10)).toBe(1);
  });

  it("Cycles array find element & step", () => {
    let arr = [{ x: 4 }, { x: 3 }, { x: 0 }, { x: 2 }, { x: 5 }, { x: 1 }];
    expect(array.cycleTo(arr, (o) => o.x == 2, 1)).toEqual({ x: 5 });
    expect(array.cycleTo(arr, (o) => o.x == 2, 2)).toEqual({ x: 1 });
    expect(array.cycleTo(arr, (o) => o.x == 2, 3)).toEqual({ x: 4 });
  });

  it("Gets next increment key", () => {
    let a = [2, 3, 5];
    expect(array.inc(a, 1)).toEqual(2);
    expect(array.inc(a, 2)).toEqual(0);
  });

  it("removes elements from array & returns the removed elements", () => {
    let o = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(array.remove(o, (x) => x % 2 == 0, 2, 1)).toEqual([2, 4]);
    expect(o).toEqual([1, 3, 5, 6, 7, 8]);
    expect(array.remove(o, (x) => x % 3 == 0, 2)).toEqual([3, 6]);
    expect(o).toEqual([1, 5, 7, 8]);
  });

  it("Toggles (add or removes) an element", () => {
    let o = [1, 2, 3, 4, 5, 6, 7, 8];
    let add = array.toggle(o, 4);
    expect(add).toBe(false);
    expect(o).toEqual([1, 2, 3, 5, 6, 7, 8]);
    add = array.toggle(o, 20);
    expect(add).toBe(true);
    expect(o).toEqual([1, 2, 3, 5, 6, 7, 8, 20]);
  });

  it("Removes indexes", () => {
    let o = [1, 2, 3, 4, 5, 6, 7, 8];
    array.removeIndexes(o, [1, 3, 12]);
    expect(o).toEqual([1, 3, 5, 6, 7, 8]);
  });

  it("Removes values", () => {
    let o = [1, 2, 3, 4, 5, 6, 7, 8];
    array.removeByVal(o, 4);
    expect(o).toEqual([1, 2, 3, 5, 6, 7, 8]);
    array.removeByVal(o, 10);
    expect(o).toEqual([1, 2, 3, 5, 6, 7, 8]);
  });

  it("Finds the maximum number of an array which is less or equal from a given number", () => {
    let o = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(array.maxOfLows(o, 3.2)).toBe(3);
    expect(array.maxOfLows(o, -1)).toBe(1);
    expect(array.maxOfLows(o, 4)).toBe(4);
  });
});
