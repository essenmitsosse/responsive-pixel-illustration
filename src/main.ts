import { inject } from '@vercel/analytics'

import { InitPixel } from '@/renderengine/init'

inject()
;((): InitPixel =>
  new InitPixel({
    div: document.getElementById('main'),
    // imageName: window.location.hash.substr(1)
  }))()
