import { Builder } from './builder.js'

export default function (init) {
  var builder = new Builder(init),
    renderList

  renderList = new builder.basic.Comic(init)

  return {
    renderList: renderList,
    variableList: builder.joinVariableList,
    background: builder.backgroundColor,
  }
}
