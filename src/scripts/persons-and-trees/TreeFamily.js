import Object from './Object'

const TreeFamily = function (args) {
  this.chance = this.R()

  // Forms & Sizes
  this.minFoliagePos = (this.R(0, 1) + 0.4) * 0.5

  // branches
  this.branchCount = Math.floor(this.R(0, 1) * 3 + 3)

  this.thinner = 0.8 / this.branchCount

  this.shorter = this.R(0, 1) * 0.8

  this.horFactor = this.R(0, 1) * 0.6 + 0.4

  this.fruit = this.IF()

  this.fruitChance = this.fruit && this.R(0, 1) * 0.02

  this.fruitSize = this.fruit && this.GR(2, 4)

  this.leaveX = this.GR(1, 4)

  this.leaveY = this.GR(1, 4)

  this.leaveDetail = this.IF(0.8)

  this.leaveDetailX =
    this.leaveDetail && this.leaveX > this.leaveY ? this.leaveX : 1

  this.leaveDetailY = this.leaveDetail && this.leaveX === 1 ? this.leaveY : 1

  this.fooliageCoverage = this.IF(0.3) && this.R(0, 1) * 0.5 + 1

  this.crooked = this.IF()

  this.noDetail = this.IF()

  this.detailSX = !this.noDetail && this.GR(1, 4)

  this.detailSY = !this.noDetail && this.GR(1, 4)

  // Colors
  this.trunkColor = args.groundColor
    ? (args.skyColor && this.IF(0.2) ? args.skyColor : args.groundColor).copy({
        brSet: Math.floor(this.GR(1, 4)),
      })
    : new this.Color(this.IF() ? 1 : 0, Math.floor(this.GR(1, 4)))

  this.trunkColorDetail = this.trunkColor.copy({ brContrast: -1 })

  this.foliageColor = args.skyColor
    ? (args.groundColor && this.IF(0.8)
        ? args.skyColor
        : args.groundColor
      ).copy({ brContrast: this.IF() ? -2 : 2 })
    : this.trunkColor.copy({
        nextColor: this.IF(),
        brContrast: this.IF() ? -2 : 2,
      })

  this.foliageColorDetail = this.foliageColor.copy({ brAdd: -1 })

  // this.groundColor = this.trunkColor.copy( { nextColor: this.IF(), brContrast: this.IF() ? -1 : 1 } );
  this.fruitColor =
    this.fruit &&
    this.foliageColor.copy({ nextColor: this.IF(0.8), brContrast: 2 })
}

// END TreeFamily
TreeFamily.prototype = new Object()

export default TreeFamily
