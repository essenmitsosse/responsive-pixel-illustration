import TableComic from './TableComic'
import './accessoir'
import './actor'
import './actor-arm'
import './actor-head'
import './actor-legs'
import './stage'
import './strip'
import './tablecomic2'
;(function (tablePrototype) {
  for (const key in tablePrototype) {
    tablePrototype[key].prototype.basic = tablePrototype
  }
})(TableComic.prototype)

export default new TableComic({})
