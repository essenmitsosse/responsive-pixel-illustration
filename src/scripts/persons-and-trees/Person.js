import BodyBasic from './BodyBasic'

const Person = function (args, state) {
  this.state = state

  if (!args) {
    args = args || {}
  }

  this.state = state

  // Assests
  this.basicBody = new BodyBasic(args, state)

  this.id = state.basic.objectCount += 1
}
// END Person

Person.prototype.draw = function (args, z) {
  args.nr = this.state.basic.objectCount += 1

  const backView = (args.backView = args.view === 'backView')
  const sideView = (args.sideView = !backView && args.view ? true : false)

  args.id = this.id

  if (!z) {
    z = this.state.basic.objectCount * 10000
  }

  args.personHalfSX = this.state.pushLinkList({
    r: 0.5,
    min: 5,
    useSize: args.size,
  })

  return sideView
    ? [{ list: this.basicBody.draw(args, args.view === 'rightView') }]
    : [
        {
          sX: args.personHalfSX,
          rX: true,
          list: this.basicBody.draw(args, !backView),
        },
        {
          sX: args.personHalfSX,
          x: [args.personHalfSX, -1],
          list: this.basicBody.draw(args, backView),
        },
      ]
}

export default Person
