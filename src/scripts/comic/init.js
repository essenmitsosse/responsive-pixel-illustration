import { TableComic } from './main'

for (const key in TableComic.prototype) {
  TableComic.prototype[key].prototype.basic = TableComic.prototype
}

const comic = (init, slide, createSlider) => {
  const tableComic = new TableComic(init, slide, createSlider)

  return {
    ...tableComic,
    recommendedPixelSize: tableComic.recommendedPixelSize,
    renderList: tableComic.renderList,
  }
}

export default comic
