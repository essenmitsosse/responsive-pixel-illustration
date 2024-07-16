import { ImageFunctionGetter } from 'src/responsivePixel/PixelGraphics/types'
import { Comic } from './comic'
import './comic-actor'
import './comic-actors'
import './comic-background'
import './comic-world'
import './finish'

const imageFunction: ImageFunctionGetter = {
  getImageFunction: (args: unknown = {}) => new Comic(args),
}

export default imageFunction
