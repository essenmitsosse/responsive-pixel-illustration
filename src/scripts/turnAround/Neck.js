class Neck {
  constructor(args) {
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
