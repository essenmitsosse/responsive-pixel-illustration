import { Builder } from './builder.js'

function builderOld(init) {
  var builder = new Builder(init),
    renderList

  renderList = new builder.basic.Comic(init)

  return {
    renderList,
    variableList: builder.joinVariableList,
    background: builder.backgroundColor,
  }
}

export default builderOld
