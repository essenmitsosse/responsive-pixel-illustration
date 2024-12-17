import { TableComic } from './main.js'

for (const key in TableComic.prototype) {
  TableComic.prototype[key].prototype.basic = TableComic.prototype
}

const comic = (init, slide, createSlider) =>
  new TableComic(init, slide, createSlider)

export default comic
