import BBObj from './BBObj'

class Neck extends BBObj {
  constructor(args) {
    super()

    this.color = args.color

    this.colorDark = args.colorDark
  }

  draw() {
    return [
      {
        color: this.colorDark,
      },
    ]
  }
}

export default Neck
