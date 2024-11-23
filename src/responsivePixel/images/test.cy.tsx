import argos from './argos'
import betterBuilder from './betterBuilder'
import brothers from './brothers'
import comicBuilder from './comicBuilder'
import graien from './graien'
import relativity from './relativity'
import sparta from './sparta'
import sphinx from './sphinx'
import stripes from './stripes'
import stripes2 from './stripes2'
import tableComic from './tableComic'
import tantalos from './tantalos'
import teiresias from './teiresias'
import trex from './trex'
import typo from './typo'
import zeus from './zeus'
import { DO_SCREENSHOT_LIST_IMAGE } from './HELPER_SCREENSHOTS'

DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: argos, NAME: 'argos' })
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: betterBuilder.getImageFunction({ id: 1 }),
  NAME: 'better-builder',
  LIST_SIZE: [{ SIZE_X: 100, SIZE_Y: 100 }],
})
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: betterBuilder.getImageFunction({ id: 2 }),
  NAME: 'better-builder',
  LIST_SIZE: [{ SIZE_X: 350, SIZE_Y: 180 }],
})
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: betterBuilder.getImageFunction({ id: 3 }),
  NAME: 'better-builder',
  LIST_SIZE: [{ SIZE_X: 200, SIZE_Y: 400 }],
})
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: brothers, NAME: 'brothers' })
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: comicBuilder.getImageFunction({ id: 1 }),
  NAME: 'comic-builder',
  LIST_SIZE: [{ SIZE_X: 200, SIZE_Y: 200 }],
})
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: comicBuilder.getImageFunction({ id: 2 }),
  NAME: 'comic-builder',
  LIST_SIZE: [{ SIZE_X: 120, SIZE_Y: 250 }],
})
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: comicBuilder.getImageFunction({ id: 3 }),
  NAME: 'comic-builder',
  LIST_SIZE: [{ SIZE_X: 300, SIZE_Y: 190 }],
})
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: graien, NAME: 'graien' })
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: relativity, NAME: 'relativity' })
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
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: stripes2.getImageFunction({}),
  NAME: 'stripes2',
  LIST_SIZE: [
    { SIZE_X: 50, SIZE_Y: 50 },
    { SIZE_X: 60, SIZE_Y: 120 },
    { SIZE_X: 100, SIZE_Y: 60 },
  ],
})
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: tableComic.getImageFunction({ id: 1 }),
  NAME: 'table-comic',
  LIST_SIZE: [{ SIZE_X: 200, SIZE_Y: 200 }],
})
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: tableComic.getImageFunction({ id: 2 }),
  NAME: 'table-comic',
  LIST_SIZE: [{ SIZE_X: 120, SIZE_Y: 250 }],
})
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: tableComic.getImageFunction({ id: 3 }),
  NAME: 'table-comic',
  LIST_SIZE: [{ SIZE_X: 300, SIZE_Y: 190 }],
})
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: tableComic.getImageFunction({ id: 1, altVersion: true }),
  NAME: 'table-comic-alt',
  LIST_SIZE: [{ SIZE_X: 200, SIZE_Y: 200 }],
})
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: tableComic.getImageFunction({ id: 2, altVersion: true }),
  NAME: 'table-comic-alt',
  LIST_SIZE: [{ SIZE_X: 120, SIZE_Y: 250 }],
})
DO_SCREENSHOT_LIST_IMAGE({
  IMAGE_FUNCTION: tableComic.getImageFunction({ id: 3, altVersion: true }),
  NAME: 'table-comic-alt',
  LIST_SIZE: [{ SIZE_X: 300, SIZE_Y: 190 }],
})
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: tantalos, NAME: 'tantalos' })
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: teiresias, NAME: 'teiresias' })
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: trex, NAME: 'trex' })
DO_SCREENSHOT_LIST_IMAGE({ IMAGE_FUNCTION: typo, NAME: 'typo' })
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
