import { describe, it, expect } from "vitest";
import { jaccardSimilarity, overallSimilarity } from "../lib/search/similarity";

describe("similarity", () => {
  it("computes jaccard similarity", () => {
    expect(jaccardSimilarity(["a", "b"], ["b", "c"]).toFixed(2)).toBe("0.33");
  });

  it("computes overall similarity from tags and colors", () => {
    const score = overallSimilarity(
      ["cat", "pet", "animal"],
      ["cat", "cute"],
      ["#ffffff"],
      ["#ffffff"]
    );
    expect(score).toBeGreaterThan(0);
  });
});
