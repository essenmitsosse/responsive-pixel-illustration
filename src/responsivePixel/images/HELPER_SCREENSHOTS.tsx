import { ImageFunction } from '../../responsivePixel/PixelGraphics/types'
import Canvas from '../../views/Canvas'

const GET_NAME_FORMAT = (ARGS: {
  SIZE_X: number
  SIZE_Y: number
}): 'landscape' | 'portrait' | 'square' =>
  ARGS.SIZE_X === ARGS.SIZE_Y
    ? 'square'
    : ARGS.SIZE_X > ARGS.SIZE_Y
      ? 'landscape'
      : 'portrait'

export const DO_SCREENSHOT_IMAGE = (ARGS: {
  IMAGE_FUNCTION: ImageFunction
  NAME: string
  SIZE_X: number
  SIZE_Y: number
}) =>
  it(`${ARGS.SIZE_X}x${ARGS.SIZE_Y}`, () => {
    cy.viewport(ARGS.SIZE_X, ARGS.SIZE_Y)
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <Canvas
        imageFunction={ARGS.IMAGE_FUNCTION}
        sizeRelX={1}
        sizeRelY={1}
        pixelSize={1}
        sizeAbsXFull={ARGS.SIZE_X}
        sizeAbsYFull={ARGS.SIZE_Y}
      />,
    )

    cy.get('body').contains('Bild rendert').should('not.exist')

    cy.screenshot(
      `${ARGS.NAME}-${GET_NAME_FORMAT(ARGS)}-${ARGS.SIZE_X}x${ARGS.SIZE_Y}`,
      {
        overwrite: true,
      },
    )
  })

const LIST_SIZE_SCREENSHOT_DEFAULT: ReadonlyArray<{
  SIZE_X: number
  SIZE_Y: number
}> = [
  { SIZE_X: 25, SIZE_Y: 25 },
  { SIZE_X: 50, SIZE_Y: 50 },
  { SIZE_X: 100, SIZE_Y: 100 },
  { SIZE_X: 200, SIZE_Y: 200 },
  { SIZE_X: 70, SIZE_Y: 400 },
  { SIZE_X: 450, SIZE_Y: 60 },
  { SIZE_X: 320, SIZE_Y: 180 },
  { SIZE_X: 240, SIZE_Y: 320 },
]

export const DO_SCREENSHOT_LIST_IMAGE = (ARGS: {
  IMAGE_FUNCTION: ImageFunction
  NAME: string
  LIST_SIZE?: ReadonlyArray<{ SIZE_X: number; SIZE_Y: number }>
}) =>
  describe(ARGS.NAME, () => {
    ;(ARGS.LIST_SIZE ?? LIST_SIZE_SCREENSHOT_DEFAULT).forEach((SIZE) => {
      DO_SCREENSHOT_IMAGE({ ...ARGS, ...SIZE })
    })
  })
