class HeadBottom {
  constructor(args) {
    this.color = args.color

    this.colorDark = args.colorDark
  }

  draw(args, front) {
    return [
      { color: !front && this.colorDark },

      // MOUTH
      front && {
        color: this.black,
        sX: { r: 0.6 },
        y: { r: 0.2, min: 1 },
        fY: true,
        fX: true,
        sY: 1,
      },

      // // BEARD
      // front && {
      // 	fY:true,
      // 	tY:true,
      // 	y:1,
      // 	z:100,
      // 	id:"beard",
      // 	color:this.black,
      // },
    ]
  }
}

export default HeadBottom