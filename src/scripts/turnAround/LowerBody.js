import BBObj from './BBObj'

// LOWER BODY  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class LowerBody extends BBObj {
  constructor(args) {
    super()

    this.color = args.color

    this.colorDark = args.colorDark
  }

  draw(args, front, right) {
    return [
      {
        color: [front ? 150 : 100, right ? 150 : 100, front || right ? 0 : 0],
      },
    ]
  }
}

export default LowerBody
