import { test, expect } from "@playwright/test";

test.describe("Exam Runner Flow", () => {
  test("should complete full exam flow: signup, login, start exam, answer, submit, view results", async ({ page }) => {
    const email = `learner-${Date.now()}@example.com`;
    const password = "SuperSecure!123";

    await page.goto("/signup");
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign up" }).click();

    await page.waitForURL("/login");
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForURL("/dashboard");
    await page.waitForLoadState("networkidle");

    await page.goto("/exams");
    await page.getByRole("button", { name: /Start/i }).first().click();

    await page.waitForURL(/\/attempts\//);
    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: /Submit/i }).click();

    await page.getByRole("button", { name: /Confirm submit/i }).click();
    await page.waitForURL(/\/result/);

    await expect(page.getByText(/Score/i)).toBeVisible();
  });
});
