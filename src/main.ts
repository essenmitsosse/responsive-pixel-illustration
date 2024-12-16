import { inject } from '@vercel/analytics'

import { InitPixel } from '@/renderengine/init'

inject()

new InitPixel({
  div: document.getElementById('main'),
  // imageName: window.location.hash.substring(1)
})
