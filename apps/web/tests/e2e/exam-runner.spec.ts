import { test, expect } from "@playwright/test";

test.describe("Exam Runner Flow", () => {
  test("should complete full exam flow: login, start exam, answer, submit, view results", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: "Email" }).fill("learner@example.com");
    await page.getByLabel("Password").fill("SuperSecure!123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForURL("/dashboard");
    await page.waitForLoadState("networkidle");

    await page.goto("/exams");
    await page.getByRole("link", { name: /Start/i }).first().click();

    await page.waitForURL(/\/attempts\//);
    await page.getByRole("radio").first().check();
    await page.getByRole("button", { name: /Submit/i }).click();

    await page.getByRole("button", { name: /Confirm submit/i }).click();
    await page.waitForURL(/\/result/);

    await expect(page.getByText(/Score/i)).toBeVisible();
  });
});
