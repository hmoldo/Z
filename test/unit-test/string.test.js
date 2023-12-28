import { expect, describe, it } from "vitest";
import * as Z from "/src/STRING";

let o = {
  p0: "v0",
  p1: "v1",
  p2: "v2",
  p3: "v3",
  p4: "v4",
  p5: "v5",
  p6: "v6",
};

describe("String utilities", () => {
  it("Capitalizes first string character", () => {
    expect(Z.capitalize("test")).toBe("Test");
  });

  it("Converts dash separated string to camelCase", () => {
    expect(Z.toCamel("this-is-a-test-string")).toBe("thisIsATestString");
    expect(Z.toCamel("this-is-a-Test-String")).toBe("thisIsATestString");
    expect(Z.toCamel("arrow-Class-Opened")).toBe("arrowClassOpened");
    expect(Z.toCamel("productId")).toBe("productId");
  });

  it("Decamilizes string", () => {
    expect(Z.decamelize("thisIsATestString")).toBe("this-is-a-test-string");
    expect(Z.decamelize("arrowClassOpened")).toBe("arrow-class-opened");
    expect(Z.decamelize("productId")).toBe("product-id");
  });

  it("Get first match of a reg expression", () => {
    expect(Z.getFirstMatch("This is a test", "is")).toBe("is");
  });

  it("Returns first alphabetic character from string", () => {
    expect(Z.getFirstChar("  56x56fghg4g")).toBe("x");
  });

  it("Splits to commas", () => {
    expect(Z.splitCommas("a,b,c ,d   , e")).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("Get integer from variable 2", () => {
    expect(Z.int(5.2)).toBe(5);
    expect(Z.int(5)).toBe(5);
    expect(Z.int(-5.2)).toBe(-5);
    expect(Z.int("5s")).toBe(5);
    expect(Z.int("s5")).toBe(5);
    expect(Z.int("2s5")).toBe(2);
  });

  it("Wraps with string with brackets", () => {
    expect(Z.addBrackets("test")).toEqual("[test]");
    expect(Z.addBrackets("[test]")).toEqual("[test]");
    expect(Z.addBrackets("[test]", 2)).toEqual("[[test]]");
  });

  it("Gets last part of string after last occurrence of substr", () => {
    expect(Z.getLastPartAfter("This is a test", " is ")).toEqual("a test");
  });

  it("Removes outer tag from html string", () => {
    expect(Z.removeOuterTags("<div>This is a test</div>")).toEqual(
      "This is a test"
    );
    expect(Z.removeOuterTags("iv>This is a test</div>")).toEqual(
      "iv>This is a test</div>"
    );
  });

  it("Unescape html.", () => {
    // @vitest-environment jsdom
    expect(Z.unescapeHTML("x&lt;y")).toEqual("x<y");
    expect(Z.unescapeHTML("<div>test</div>")).toEqual("<div>test</div>");
  });

  it("Tags substrings of string", () => {
    expect(Z.wrapTag("This is a test", " is ", "mark")).toEqual(
      "This<mark> is </mark>a test"
    );
  });

  it("Tags part of string", () => {
    expect(Z.tagAt("This is a test", 2, 5, "span")).toEqual(
      "Th<span>is is</span> a test"
    );
  });

  it("Slugifies string", () => {
    expect(Z.slugify(" Te-st12 te!st")).toEqual("test12-test");
  });

  it("Joins array filtering out empties", () => {
    expect(Z.join(["This", "is", 0, "a", "", "test"])).toEqual(
      "This is a test"
    );
  });

  it("Trims a character", () => {
    expect(Z.trim("cThis is a testc", "c")).toEqual("This is a test");
  });

  it("Gets filename from path", () => {
    expect(Z.trim("cThis is a testc", "c")).toEqual("This is a test");
  });

  it(" Inserts a string in another string at specific point", () => {
    expect(Z.insertStrAt("And another item", 4, "this is ")).toEqual(
      "And this is another item"
    );
  });

  it("Encodes comma sep string", () => {
    expect(Z.encode([0, 100, 1000, 10000])).toEqual("0i64i3e8i2710");
  });

  it("Decodes comma sep string", () => {
    expect(Z.decode("0i64i3e8i2710")).toEqual([0, 100, 1000, 10000]);
  });
});
