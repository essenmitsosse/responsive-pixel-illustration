/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Builder from './builder'
const renderer = function (init) {
  const help = helper
  const { getSmallerDim } = help
  const { getBiggerDim } = help
  const { mult } = help
  const { sub } = help

  const builder = new Builder(init)

  let renderList

  renderList = new builder.basic.Comic(init)

  return {
    renderList,
    variableList: builder.joinVariableList,
    background: builder.backgroundColor,
  }
}
