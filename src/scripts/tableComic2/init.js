import { TableComic } from './main.js'

for (var key in TableComic.prototype) {
  TableComic.prototype[key].prototype.basic = TableComic.prototype
}

export default TableComic
