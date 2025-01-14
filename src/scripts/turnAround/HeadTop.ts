import BBObj from './BBObj'

class HeadTop extends BBObj {
  constructor(args, state) {
    super(state)

    this.color = args.color

    this.colorDark = args.colorDark

    this.eyeSYLeft = this.state.R(0.2, 0.9)

    this.eyeSYRight = this.state.IF(0.5)
      ? this.eyeSYLeft
      : this.eyeSYLeft + this.state.R(-0.1, 0.1)
  }

  draw(args, front, right) {
    return [
      { color: front ? undefined : this.colorDark },

      // HAIR TOP
      {
        color: this.black,
        sY: { r: 0.1 },
      },

      // HAIR SIDE
      {
        color: this.black,
        sX: front ? { r: 0.2 } : undefined,
        sY: { r: 0.9 },
        z: 5,
      },

      // EYE
      front
        ? {
            color: this.white,
            sX: { r: 0.3, min: 1 },
            sY: {
              r: right ? this.eyeSYRight : this.eyeSYLeft,
              min: 1,
              max: { r: 1, a: -3 },
            },
            x: { r: 0.1, min: { a: 1, max: { r: 0.2 } } },
            y: { r: 0.1, min: 2 },
            fX: true,
            fY: true,
            z: 10,
            id: 'eye',
            list: [
              {},
              {
                color: this.black,
                sX: { r: 0.6 },
                sY: { r: 0.7 },
                fX: true,
                fY: true,
              },
            ],
          }
        : undefined,
    ]
  }
}

export default HeadTop
