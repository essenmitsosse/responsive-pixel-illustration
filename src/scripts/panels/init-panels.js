import { Builder } from './builder.js'

function builderOld(init) {
  const builder = new Builder(init)
  const renderList = new builder.basic.Comic(init)

  return {
    renderList,
    variableList: builder.joinVariableList,
    background: builder.backgroundColor,
  }
}

export default builderOld
