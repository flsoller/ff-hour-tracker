import { describe, expect, it } from "vitest";
import { validateEmail, validateInputString } from "../../utils/validate";

describe("validate", () => {
  describe("validateInputString", () => {
    it.concurrent("should return correct object for valid input", () => {
      ["   one", "two", "three   "].forEach((v) =>
        expect(validateInputString(v)).toStrictEqual({
          valid: true,
          message: null,
        })
      );
    });

    it.concurrent("should return correct object for invalid input", () => {
      ["   ", ""].forEach((v) =>
        expect(validateInputString(v)).toStrictEqual({
          valid: false,
          message: "Input Required",
        })
      );
    });
  });

  describe("validateEmail", () => {
    it.concurrent("should return correct object for valid email", () => {
      ["one@t.co", "x.y.a@bc.vs", "82364asd@abc.com"].forEach((v) =>
        expect(validateEmail(v)).toStrictEqual({
          valid: true,
          message: null,
        })
      );
    });

    it.concurrent("should return correct object for invalid email", () => {
      ["   ", "", "@ab", "w.s@", "go"].forEach((v) =>
        expect(validateEmail(v)).toStrictEqual({
          valid: false,
          message: "Invalid Email",
        })
      );
    });
  });
});
