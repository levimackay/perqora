import { describe, expect, it } from "vitest";
import { looksLikeSchoolEmail } from "@/lib/eligibility";

describe("looksLikeSchoolEmail", () => {
  it("accepts a .edu address", () => {
    expect(looksLikeSchoolEmail("student@byui.edu")).toBe(true);
  });

  it("accepts a non-US academic domain using .ac.", () => {
    expect(looksLikeSchoolEmail("student@example.ac.uk")).toBe(true);
  });

  it("rejects a personal email provider", () => {
    expect(looksLikeSchoolEmail("student@gmail.com")).toBe(false);
  });

  it("rejects malformed input without a domain", () => {
    expect(looksLikeSchoolEmail("not-an-email")).toBe(false);
    expect(looksLikeSchoolEmail("")).toBe(false);
  });
});
