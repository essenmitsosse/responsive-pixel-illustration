import { TableComic } from './main.js'

for (let key in TableComic.prototype) {
  TableComic.prototype[key].prototype.basic = TableComic.prototype
}

export default TableComic
