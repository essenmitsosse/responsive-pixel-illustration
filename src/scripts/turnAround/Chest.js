import BBObj from './BBObj'

class Chest extends BBObj {
  constructor(args) {
    super()

    this.color = args.color

    this.colorDark = args.colorDark
  }

  draw(args, front, right) {
    return [
      {
        color: [front ? 200 : 150, right ? 200 : 150, front || right ? 0 : 0],
      },
    ]
  }
}

export default Chest
