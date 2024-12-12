// @ts-check
import { expect, test } from '@playwright/test'

const listScreenshots = [
  { index: 0, niceName: 'The Three Graeae' },
  { index: 1, niceName: 'Tantalos' },
  { index: 2, niceName: 'Teiresias' },
  { index: 3, niceName: 'Brothers' },
  { index: 4, niceName: 'Zeus' },
  { index: 5, niceName: 'The Argos' },
  { index: 5, niceName: 'The Argos hires', query: 'p=1' },
  { index: 6, niceName: 'The Sphinx' },
  { index: 7, niceName: 'Letter' },
  {
    index: 8,
    niceName: 'Trees',
    query: 'id=2',
  },
  {
    index: 9,
    niceName: 'Persons',
    query: 'id=2',
  },
  {
    index: 9,
    niceName: 'Persons (alt)',
    query:
      'id=362604470&p=2&panelCount=6&head-size=1&body-width=0.94&body-height=1&arm-length=0.26&leg-length=0.6&dontHighlight=true&forceSliders=true&a=0.9645569620253165&b=0.08994708994708994',
  },
  { index: 10, niceName: 'Panels', query: 'id=3381513778&p=3' },
  {
    index: 11,
    niceName: 'Turnaround',
    query: 'id=1454415252&p=2&vari=5&rows=4',
  },
  {
    index: 12,
    niceName: 'Comic 2',
    query:
      'id=3547888882&slide=12&panels=6&imgRatio=1&gutter-width=0.25&gutter-height=0.25&a=0&b=0&camera=0&altCamera=0&actor-size=0.5&actor-color=0&actor-features=0&actor-accessoirs=0&emotions=0&set=0&props=0',
  },
  {
    index: 12,
    niceName: 'Comic 2 (alt)',
    query:
      'p=1&id=646298878&slide=12&panels=6&imgRatio=0.42&gutter-width=0.26&gutter-height=0.44&a=1&b=1&camera=1&altCamera=1&actor-size=1&actor-color=1&actor-features=1&actor-accessoirs=1&emotions=1&set=1&props=1',
  },
  {
    index: 12,
    niceName: 'faceversion',
    query: 'id=234243242&slide=12&faceVersion=true',
  },
  {
    index: 12,
    niceName: 'faceversion (alt)',
    query:
      'id=32423423&slide=12&p=2&faceVersion=true&a=1&b=0&c=0.2&d=0.8&e=0.8&f=0.3&g=0.7&h=0.4&i=0.6&j=0.1&k=0.9&l=0.9&m=0.9&n=0.1&camera=0&side=1',
  },
  { index: 13, niceName: 'Relativity' },
  { index: 14, niceName: 'Stripe' },
  { index: 16, niceName: 'Sparta' },
  { index: 17, niceName: 'T-Rex', query: 'p=10' },
  { index: 18, niceName: 'Typo' },
  {
    index: 19,
    name: 'random-distribution',
    niceName: 'Random',
    query: 'id=1234',
  },
]

listScreenshots.forEach(({ niceName, query, index }) => {
  test(niceName, async ({ page }) => {
    await page.goto(`/?slide=${index}&${query}`)

    await expect(page).toHaveScreenshot(`${niceName}.png`)
  })
})

test('interact with sliders', async ({ page }) => {
  await page.goto(
    '/?slide=9&id=362604472&p=5&panelCount=6&head-size=0&body-width=0.94&body-height=1&arm-length=0.26&leg-length=0.6&dontHighlight=true',
  )

  const panelsInput = page.locator('input[type="number"]').first()

  await panelsInput.fill('12')

  await panelsInput.press('Enter')

  await page.waitForURL('/?slide=9&*')

  const sliderTrack = page.locator('input[type="range"]').first()
  const sliderOffsetWidth = await sliderTrack.evaluate((el) =>
    el.getBoundingClientRect(),
  )

  await page.mouse.click(
    sliderOffsetWidth.x + sliderOffsetWidth.width - 10,
    sliderOffsetWidth.y + sliderOffsetWidth.height / 2,
  )

  // eslint-disable-next-line playwright/no-wait-for-timeout -- Currently there is no better way to make sure the slider updated
  await page.waitForTimeout(1000)

  await expect(page).toHaveScreenshot('slider-before.png')
})

test('interact with sliders (Graeae)', async ({ page }) => {
  await page.goto('/?slide=0')

  await page.waitForURL('/?slide=0')

  const inputs = page.locator('input[type="range"]')
  const sliderOffsetWidth0 = await inputs
    .nth(0)
    .evaluate((el) => el.getBoundingClientRect())
  const sliderOffsetWidth1 = await inputs
    .nth(1)
    .evaluate((el) => el.getBoundingClientRect())
  const sliderOffsetWidth2 = await inputs
    .nth(2)
    .evaluate((el) => el.getBoundingClientRect())

  await page.mouse.click(
    sliderOffsetWidth0.x + 10,
    sliderOffsetWidth0.y + sliderOffsetWidth0.height / 2,
  )

  await page.mouse.click(
    sliderOffsetWidth1.x + sliderOffsetWidth1.width - 10,
    sliderOffsetWidth1.y + sliderOffsetWidth1.height / 2,
  )

  await page.mouse.click(
    sliderOffsetWidth2.x + 10,
    sliderOffsetWidth2.y + sliderOffsetWidth2.height / 2,
  )

  // eslint-disable-next-line playwright/no-wait-for-timeout -- Currently there is no better way to make sure the slider updated
  await page.waitForTimeout(1000)

  await expect(page).toHaveScreenshot('The-Three-Graeae-slider.png')
})
