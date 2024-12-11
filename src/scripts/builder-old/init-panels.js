import { Builder } from './builder.js'

function builderOld(init) {
  var builder = new Builder(init)
  var renderList

  renderList = new builder.basic.Comic(init)

  return {
    renderList,
    variableList: builder.joinVariableList,
    background: builder.backgroundColor,
  }
}

export default builderOld
