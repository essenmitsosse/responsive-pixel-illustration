// @ts-check
import { test, expect } from "@playwright/test";

const listScreenshots = [
	{ index: 0, niceName: "The Three Graeae" },
	{ index: 1, niceName: "Tantalos" },
	{ index: 2, niceName: "Teiresias" },
	{ index: 3, niceName: "Brothers" },
	{ index: 4, niceName: "Zeus" },
	{ index: 5, niceName: "The Argos" },
	{ index: 6, niceName: "The Sphinx" },
	{ index: 7, niceName: "Letter" },
	{
		index: 8,
		niceName: "Trees",
		query: "id=2",
	},
	{
		index: 9,
		niceName: "Persons",
		query: "id=2",
	},
	{
		index: 9,
		niceName: "Persons (alt)",
		query: "id=362604470&p=2&panelCount=6&head-size=1&body-width=0.94&body-height=1&arm-length=0.26&leg-length=0.6&isServer=false&dontHighlight=true&forceSliders=true&a=0.9645569620253165&b=0.08994708994708994",
	},
	{ index: 10, niceName: "Panels", query: "id=3381513778&p=3" },
	{
		index: 11,
		niceName: "Turnaround",
		query: "id=1454415252&p=2&vari=5&rows=4",
	},
	{
		index: 12,
		niceName: "Comic 2",
		query: "id=3547888882&slide=12&panels=6&imgRatio=1&gutter-width=0.25&gutter-height=0.25&a=0&b=0&camera=0&altCamera=0&actor-size=0.5&actor-color=0&actor-features=0&actor-accessoirs=0&emotions=0&set=0&props=0",
	},
	{
		index: 12,
		niceName: "Comic 2 (alt)",
		query: "p=1&id=646298878&slide=12&panels=6&imgRatio=0.42&gutter-width=0.26&gutter-height=0.44&a=1&b=1&camera=1&altCamera=1&actor-size=1&actor-color=1&actor-features=1&actor-accessoirs=1&emotions=1&set=1&props=1",
	},
	{ index: 13, niceName: "Relativity" },
	{ index: 14, niceName: "Stripe" },
	{ index: 16, niceName: "Sparta" },
	{ index: 17, niceName: "T-Rex", query: "p=10" },
	{ index: 18, niceName: "Typo" },
	{
		index: 19,
		name: "random-distribution",
		niceName: "Random",
		query: "id=1234",
	},
];

listScreenshots.forEach(({ niceName, query, index }) => {
	test(niceName, async ({ page }) => {
		await page.goto(`/?slide=${index}&${query}`);
		await expect(page).toHaveScreenshot(`${niceName}.png`);
	});
});
