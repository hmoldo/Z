import { expect, test } from "vitest";
import * as math from "/src/MATH";

test("Generates random number (min included to max excluded)", () => {
  let i, x;
  for (i = 0; i < 20; i++) {
    x = math.rand(7, 8);
    expect(x).toBeGreaterThanOrEqual(7);
    expect(x).toBeLessThan(8);
  }
});

test("Generates random integer (limits included)", () => {
  let i, x;
  for (i = 0; i < 20; i++) {
    x = math.randInt(3, 8);
    expect(x).toBeGreaterThanOrEqual(3);
    expect(x).toBeLessThanOrEqual(8);
  }
});

test("Clamps number between limits", () => {
  expect(math.clamp(1, 5, 10)).toBe(5);
  expect(math.clamp(12, 5, 10)).toBe(10);
  expect(math.clamp(8, 5, 10)).toBe(8);
});

test("Interpolates", () => {
  let o = { min: -10, max: 20, start: -40, end: 80 };
  //check the limits
  expect(math.lerp(-40, o)).toBe(-10);
  expect(math.lerp(80, o)).toBe(20);
  // below limit
  expect(math.lerp(-50, o)).toBe(-10);
  // above limit
  expect(math.lerp(90, o)).toBe(20);
  // middle point
  expect(math.lerp(20, o)).toBe(5);
});

test("Calculates covered rect keeping aspect ratio", () => {
  expect(math.cover(10, 10, 0.5)).toEqual({
    x: 0,
    y: -5,
    width: 10,
    height: 20,
    scale: 2,
    isY: true,
  });
  expect(math.cover(10, 10, 2)).toEqual({
    x: -5,
    y: 0,
    width: 20,
    height: 10,
    isY: false,
    scale: 2,
  });
});

test("Calculates contained rect keeping aspect ratio", () => {
  expect(math.contain(10, 10, 0.5)).toEqual({
    x: 2.5,
    y: 0,
    width: 5,
    height: 10,
    scale: 1,
  });
  expect(math.contain(10, 10, 2)).toEqual({
    x: 0,
    y: 2.5,
    width: 10,
    height: 5,
    scale: 1,
  });
});

test("Finds Array aggregates", () => {
  let arr = [1, 2, 3, 4, 5];
  expect(math.arrMin(arr)).toBe(1);
  expect(math.arrMax(arr)).toBe(5);
  expect(math.arrSum(arr)).toBe(15);
  expect(math.arrAvg(arr)).toBe(3);
});

test("Finds array prev & next vals of a number", () => {
  let arr = [1, 2, 3, 4, 5];
  expect(math.getBounds(3.3, arr)).toEqual({ bottom: 3, top: 4 });
  expect(math.getBounds(3, arr)).toEqual({ bottom: 3, top: 4 });
  expect(math.getBounds(0, arr)).toEqual({ top: 1 });
  expect(math.getBounds(6, arr)).toEqual({ bottom: 5 });
});

test("Calculates distance between points", () => {
  expect(math.dist({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
});

test("Get coords of pont in line giving a distance from the start", () => {
  let start = { x: 0, y: 0 },
    end = { x: 100, y: -100 };
  expect(math.pntOnLine(start, end, 0)).toStrictEqual(start);
  expect(math.pntOnLine(start, end, 1)).toStrictEqual(end);
  expect(math.pntOnLine(start, end, 0.1)).toStrictEqual({ x: 10, y: -10 });
});
