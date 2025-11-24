import { describe, it, expect } from "vitest";
import { rgbToHex } from "../lib/utils/rgbToHex";

describe("rgbToHex", () => {
  it("converts basic RGB to hex", () => {
    expect(rgbToHex(255, 0, 0)).toBe("#ff0000");
    expect(rgbToHex(0, 255, 0)).toBe("#00ff00");
    expect(rgbToHex(0, 0, 255)).toBe("#0000ff");
  });

  it("clamps out-of-range values", () => {
    expect(rgbToHex(300, -10, 128)).toBe("#ff0080");
  });
});
