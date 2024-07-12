import { ImageFunctionGetter } from 'src/responsivePixel/PixelGraphics/types'
import './bb'
import './person-head'
import './person-lowerBody'
import './person-main'
import './person-upperBody'
import './rotation'
import BB from './bb'

const imageFunction: ImageFunctionGetter = {
  getImageFunction: (args) => {
    const bb = new BB(args)

    return {
      renderList: new bb.Overview({}, 'Head'),
      linkList: bb.ll,
      background: bb.background || [160, 200, 200],
    }
  },
}

export default imageFunction
