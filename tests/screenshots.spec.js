// @ts-check
const { test, expect } = require("@playwright/test");

test("has title", async ({ page }) => {
	await page.goto("/");
	await page.locator('strong:text("Tantalos")').click();
	await expect(page).toHaveScreenshot("tantalos.png");
});
