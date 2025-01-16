import BBObj from './BBObj'

class HeadBottom extends BBObj {
  constructor(args) {
    super()

    this.colorDark = args.colorDark
  }

  draw(args, front) {
    return [
      { color: front ? undefined : this.colorDark },

      // MOUTH
      front
        ? {
            color: this.black,
            sX: { r: 0.6 },
            y: { r: 0.2, min: 1 },
            fY: true,
            fX: true,
            sY: 1,
          }
        : undefined,

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
