import { describe, expect, it } from "vitest";
import { isHoneypotTriggered } from "./spam-guard";

describe("isHoneypotTriggered", () => {
  it("is not triggered when the field is missing", () => {
    expect(isHoneypotTriggered(undefined)).toBe(false);
  });

  it("is not triggered by an empty string", () => {
    expect(isHoneypotTriggered("")).toBe(false);
  });

  it("is not triggered by whitespace only", () => {
    expect(isHoneypotTriggered("   ")).toBe(false);
  });

  it("is triggered when a bot fills in the field", () => {
    expect(isHoneypotTriggered("http://spam.example")).toBe(true);
  });

  it("is not triggered by non-string values", () => {
    expect(isHoneypotTriggered(null)).toBe(false);
    expect(isHoneypotTriggered(123)).toBe(false);
    expect(isHoneypotTriggered({})).toBe(false);
  });
});
