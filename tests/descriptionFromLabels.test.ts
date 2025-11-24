import { describe, it, expect } from "vitest";
import { descriptionFromLabels } from "../lib/utils/descriptionFromLabels";

describe("descriptionFromLabels", () => {
  it("handles empty labels", () => {
    expect(descriptionFromLabels([])).toBe("");
  });

  it("creates readable sentences", () => {
    expect(descriptionFromLabels(["Cat"])).toContain("cat");
    expect(descriptionFromLabels(["Cat", "Dog"]).toLowerCase()).toContain(
      "cat"
    );
  });
});
