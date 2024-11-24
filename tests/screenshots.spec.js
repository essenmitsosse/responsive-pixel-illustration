// @ts-check
const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

const listScreenshots = [
	{ name: "graien", niceName: "The Three Graeae" },
	{ name: "tantalos", niceName: "Tantalos" },
	{ name: "teiresias", niceName: "Teiresias" },
	{ name: "brothers", niceName: "Brothers" },
	{ name: "zeus", niceName: "Zeus" },
	{ name: "argos", niceName: "The Argos" },
	{ name: "sphinx", niceName: "The Sphinx" },
	{ name: "letter", niceName: "Letter" },
	{ name: "persons_lessrandom", niceName: "Trees" },
	{ name: "persons_lessrandom", niceName: "Persons" },
	{ name: "panels", niceName: "Panels" },
	{ name: "turnaround", niceName: "Turnaround" },
	{ name: "table2", niceName: "Comic 2" },
	{ name: "relativity", niceName: "Relativity" },
	{ name: "stripes-1", niceName: "Stripe1" },
	{ name: "stripes-2", niceName: "Stripe2" },
	{ name: "landscape", niceName: "Landscape" },
	{ name: "sparta", niceName: "Sparta" },
	{ name: "trex", niceName: "T-Rex" },
	{ name: "typo", niceName: "Typo" },
	{ name: "random-distribution", niceName: "Random" },
];

listScreenshots.forEach(({ name, niceName }) => {
	test(niceName, async ({ page }) => {
		await page.locator(`strong:text("${niceName}")`).click();
		await expect(page).toHaveScreenshot(`${name}.png`);
	});
});
