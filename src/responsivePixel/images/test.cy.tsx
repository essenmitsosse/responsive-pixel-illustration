import argos from './argos'
import brothers from './brothers'
import graien from './graien'
import sparta from './sparta'
import sphinx from './sphinx'
import stripes from './stripes'
import tantalos from './tantalos'
import teiresias from './teiresias'
import zeus from './zeus'
import { DO_SCREENSHOT_LIST_IMAGE } from './HELPER_SCREENSHOTS'

DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: argos, NAME: 'argos' })
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: brothers, NAME: 'brothers' })
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: graien, NAME: 'graien' })
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: sparta, NAME: 'sparta' })
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: sphinx, NAME: 'sphinx' })
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: stripes,
  NAME: 'stripes',
  LIST_SIZE: [
    { SIZE_X: 50, SIZE_Y: 50 },
    { SIZE_X: 60, SIZE_Y: 120 },
    { SIZE_X: 100, SIZE_Y: 60 },
  ],
})
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: tantalos, NAME: 'tantalos' })
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: teiresias, NAME: 'teiresias' })
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: zeus,
  NAME: 'zeus',
  LIST_SIZE: [
    { SIZE_X: 50, SIZE_Y: 50 },
    { SIZE_X: 100, SIZE_Y: 100 },
    { SIZE_X: 200, SIZE_Y: 200 },
    { SIZE_X: 120, SIZE_Y: 400 },
    { SIZE_X: 450, SIZE_Y: 60 },
    { SIZE_X: 320, SIZE_Y: 180 },
    { SIZE_X: 200, SIZE_Y: 320 },
  ],
})
