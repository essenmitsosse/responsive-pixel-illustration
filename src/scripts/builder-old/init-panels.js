import { Builder } from './builder.js'

function builderOld(init) {
  let builder = new Builder(init)
  let renderList

  renderList = new builder.basic.Comic(init)

  return {
    renderList,
    variableList: builder.joinVariableList,
    background: builder.backgroundColor,
  }
}

export default builderOld
