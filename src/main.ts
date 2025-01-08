import { inject } from '@vercel/analytics'

import { InitPixel } from './renderengine/InitPixel'

if (!import.meta.env.VITE_CI && !import.meta.env.DEV) {
  inject()
}

const mainDiv = document.getElementById('main')

if (!mainDiv) {
  throw new Error('div with `id` `main` has been found')
}

new InitPixel({
  div: mainDiv,
  // imageName: window.location.hash.substring(1)
})
