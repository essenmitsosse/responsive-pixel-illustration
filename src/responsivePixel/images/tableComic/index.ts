import { ImageFunctionGetter } from 'src/responsivePixel/PixelGraphics/types'
import TableComic from './TableComic'
import './accessoir'
import './actor'
import './actor-arm'
import './actor-head'
import './actor-legs'
import './stage'
import './strip'
import './tablecomic1'
import './tablecomic2'
;(function (tablePrototype) {
  for (const key in tablePrototype) {
    tablePrototype[key].prototype.basic = tablePrototype
  }
})(TableComic.prototype)

const imageFunction: ImageFunctionGetter = {
  getImageFunction: (args) => new TableComic(args),
}

export default imageFunction
