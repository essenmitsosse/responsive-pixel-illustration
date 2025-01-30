import Color from './Color'

const TreeFamily = function (args, state) {
  this.chance = state.R()

  // Forms & Sizes
  this.minFoliagePos = (state.R(0, 1) + 0.4) * 0.5

  // branches
  this.branchCount = Math.floor(state.R(0, 1) * 3 + 3)

  this.thinner = 0.8 / this.branchCount

  this.shorter = state.R(0, 1) * 0.8

  this.horFactor = state.R(0, 1) * 0.6 + 0.4

  this.fruit = state.IF()

  this.fruitChance = this.fruit && state.R(0, 1) * 0.02

  this.fruitSize = this.fruit && state.GR(2, 4)

  this.leaveX = state.GR(1, 4)

  this.leaveY = state.GR(1, 4)

  this.leaveDetail = state.IF(0.8)

  this.leaveDetailX =
    this.leaveDetail && this.leaveX > this.leaveY ? this.leaveX : 1

  this.leaveDetailY = this.leaveDetail && this.leaveX === 1 ? this.leaveY : 1

  this.fooliageCoverage = state.IF(0.3) && state.R(0, 1) * 0.5 + 1

  this.crooked = state.IF()

  this.noDetail = state.IF()

  this.detailSX = !this.noDetail && state.GR(1, 4)

  this.detailSY = !this.noDetail && state.GR(1, 4)

  // Colors
  this.trunkColor = args.groundColor
    ? (args.skyColor && state.IF(0.2) ? args.skyColor : args.groundColor).copy({
        brSet: Math.floor(state.GR(1, 4)),
      })
    : new Color(state.IF() ? 1 : 0, Math.floor(state.GR(1, 4)))

  this.trunkColorDetail = this.trunkColor.copy({ brContrast: -1 })

  this.foliageColor = args.skyColor
    ? (args.groundColor && state.IF(0.8)
        ? args.skyColor
        : args.groundColor
      ).copy({ brContrast: state.IF() ? -2 : 2 })
    : this.trunkColor.copy({
        nextColor: state.IF(),
        brContrast: state.IF() ? -2 : 2,
      })

  this.foliageColorDetail = this.foliageColor.copy({ brAdd: -1 })

  // this.groundColor = this.trunkColor.copy( { nextColor: state.IF(), brContrast: state.IF() ? -1 : 1 } );
  this.fruitColor =
    this.fruit &&
    this.foliageColor.copy({ nextColor: state.IF(0.8), brContrast: 2 })
}

// END TreeFamily

export default TreeFamily
