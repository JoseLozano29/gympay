import { describe, expect, test } from "bun:test";

const BASE_URL = "http://localhost:3000";

describe("System Verification", () => {
  test("Frontend is served", async () => {
    const response = await fetch(BASE_URL);
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain("<!DOCTYPE html>"); // Assuming index.html has this
  });

  test("Admin login works", async () => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@gympay.com",
        password: "adminpassword",
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe("Inicio de sesión exitoso");
    expect(data.user.role).toBe("admin");
  });
});
