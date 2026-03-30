import { describe, expect, test } from "bun:test";
import { ApiError } from "@/utils/api-error";

describe("ApiError", () => {
  test("constructor sets properties", () => {
    const err = new ApiError(400, "Bad input", { email: ["Invalid"] });
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Bad input");
    expect(err.isOperational).toBe(true);
    expect(err.errors).toEqual({ email: ["Invalid"] });
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  test("badRequest factory", () => {
    const err = ApiError.badRequest("Nope", { name: ["Required"] });
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe("Nope");
    expect(err.errors).toEqual({ name: ["Required"] });
  });

  test("badRequest default message", () => {
    const err = ApiError.badRequest();
    expect(err.message).toBe("Bad request");
  });

  test("unauthorized factory", () => {
    const err = ApiError.unauthorized();
    expect(err.statusCode).toBe(401);
    expect(err.message).toBe("Unauthorized");
  });

  test("forbidden factory", () => {
    const err = ApiError.forbidden();
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe("Forbidden");
  });

  test("notFound factory", () => {
    const err = ApiError.notFound();
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Resource not found");
  });

  test("conflict factory", () => {
    const err = ApiError.conflict("Already exists");
    expect(err.statusCode).toBe(409);
    expect(err.message).toBe("Already exists");
  });

  test("tooManyRequests factory", () => {
    const err = ApiError.tooManyRequests();
    expect(err.statusCode).toBe(429);
  });

  test("internal factory is non-operational", () => {
    const err = ApiError.internal();
    expect(err.statusCode).toBe(500);
    expect(err.isOperational).toBe(false);
  });
});
