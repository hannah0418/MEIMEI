import { afterEach, describe, expect, it } from "vitest";

import { isStaffPassword } from "./staff-auth";

const original = process.env.ADMIN_PASSWORD;

afterEach(() => {
  if (original === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = original;
});

describe("isStaffPassword", () => {
  it("fails closed and accepts only the configured secret", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(isStaffPassword("anything")).toBe(false);
    process.env.ADMIN_PASSWORD = "booth-secret";
    expect(isStaffPassword(undefined)).toBe(false);
    expect(isStaffPassword("wrong")).toBe(false);
    expect(isStaffPassword("booth-secret")).toBe(true);
  });
});
