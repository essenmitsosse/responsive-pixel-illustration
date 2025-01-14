import BBObj from './BBObj'

class Nose extends BBObj {
  constructor(args) {
    super()

    this.color = args.color

    this.colorDark = args.colorDark
  }

  draw(args, front) {
    return [
      {
        color: this.colorDark,
        sY: !front && { r: 1, a: 1 },
        fY: true,
      },
    ]
  }
}

export default Nose
