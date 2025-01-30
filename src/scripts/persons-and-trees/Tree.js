import { mult, sub } from '@/helper/helperDim'

const Tree = function (args) {
  if (!args) {
    args = args || {}
  }

  this.zInd = 1000

  for (const attr in args) {
    this[attr] = args[attr]
  }

  this.nr = 0

  this.id = this.basic.objectCount += 1

  // Sizes & Forms
  this.crookedY = (this.crooked && this.R(0.2, 0.9)) || undefined

  this.crookedSX = this.crooked && this.R(1, 4)

  this.reflectCrookedTrunk = this.IF(0.5)

  this.foliageSX = this.R(0.2, 0.6)

  this.foliageSY = this.R(0, 0.2) * (1 - this.minFoliagePos) + 0.2

  this.trunkSX = this.R(0.02, 0.1)

  this.leaveChange = this.R(0, 1)

  this.random = [
    this.R(0, 1),
    this.R(0, 1),
    this.R(0, 1),
    this.R(0, 1),
    this.R(0, 1),
    this.R(0, 1),
    this.R(0, 1),
  ]

  // this.branches = this.addBranches( args, true, true, this.branchCount, 1 );

  // Copy
}
// END Tree

Tree.prototype = new Object()

Tree.prototype.draw = function (args, z, size) {
  const code = (this.code = this.id + '_' + (this.nr += 1))

  this.zInd = z

  this.randomCount = 0

  args.treeSqu = size

  args.foliageSX = this.pushLinkList({
    r: this.foliageSX,
    useSize: args.treeSqu,
    min: 1,
  })

  args.foliageSY = this.pushLinkList({
    r: this.foliageSY,
    useSize: args.foliageSX,
    min: 1,
  })

  args.trunkSX = this.pushLinkList({
    r: this.trunkSX,
    useSize: args.treeSqu,
    min: 1,
  })

  args.topTrunk = this.pushLinkList({
    r: this.crookedY,
    useSize: args.treeSqu,
  })

  return [
    // Leaves Shadow
    {
      color: this.foliageColorDetail.get(),
      seed: this.nr,
      chance: this.fooliageCoverage,
      sX: this.leaveX,
      sY: this.leaveY,
      use: 'leavesShadowBack' + code,
      z: this.zInd - 90,
    },

    // LeavesBack
    {
      color: this.foliageColor.get(),
      seed: this.nr,
      chance: this.fooliageCoverage,
      sX: this.leaveX,
      sY: this.leaveY,
      use: 'leavesBack' + code,
      z: this.zInd - 90,
    },

    // Leaves Front
    {
      color: this.foliageColor.get(),
      seed: this.nr,
      chance: this.fooliageCoverage,
      sX: this.leaveX,
      sY: this.leaveY,
      use: 'leavesFront' + code,
      z: this.zInd + 110,
    },

    // Detail Back
    this.leaveDetail &&
      !this.fooliageCoverage && {
        color: this.foliageColorDetail.get(),
        seed: this.nr,
        chance: 0.02,
        sX: this.leaveDetailX,
        sY: this.leaveDetailY,
        mask: true,
        use: 'leavesBack' + code,
        z: this.zInd - 80,
      },
    // Detail Front
    this.leaveDetail &&
      !this.fooliageCoverage && {
        color: this.foliageColorDetail.get(),
        seed: this.nr,
        chance: 0.02,
        sX: this.leaveDetailX,
        sY: this.leaveDetailY,
        mask: true,
        use: 'leavesFront' + code,
        z: this.zInd + 120,
      },

    // Fruits
    this.fruitColor && {
      color: this.fruitColor.get(),
      seed: this.nr,
      chance: this.fruitChance,
      s: this.fruitSize,
      use: 'leavesBack' + code,
      z: this.zInd - 70,
    },
    this.fruitColor && {
      color: this.fruitColor.get(),
      seed: this.nr,
      chance: this.fruitChance,
      s: this.fruitSize,
      use: 'leavesFront' + code,
      z: this.zInd + 130,
    },

    // Trunk
    {
      color: this.trunkColor.get(),
      use: 'trunk' + code,
      z: this.zInd,
    },

    // Trunk
    !this.noDetail && {
      color: this.trunkColorDetail.get(),
      use: 'trunk' + code,
      chance: 0.1,
      seed: this.nr,
      sX: this.detailSX,
      sY: this.detailSY,
      mask: true,
      z: this.zInd + 10,
    },

    // Trunk
    {
      cX: true,
      sX: args.trunkSX,
      sY: args.topTrunk,
      color: this.trunkColor.get(),
      z: this.zInd,
      list: [
        {
          list: this.addBranches(args, true, true, this.branchCount, 1),
        },
        this.crooked
          ? {
              save: 'trunk' + code,
              rX: this.reflectCrookedTrunk,
              list: [
                {
                  sY: args.trunkSX,
                  fY: true,
                  sX: {
                    r: this.crookedSX,
                    useSize: args.trunkSX,
                  },
                  list: [
                    {},
                    {
                      fX: true,
                      sX: args.trunkSX,
                      sY: [args.treeSqu, sub(args.topTrunk)],
                      fY: true,
                      tY: true,
                    },
                  ],
                },
              ],
            }
          : { save: 'trunk' + code },
      ],
    },

    // // Ground
    // {
    // 	z: this.zInd-100,
    // 	color: this.groundColor.get(),
    // 	tY: true,
    // 	fY: true,
    // 	y: {r: 0.2}
    // }
  ]
}
// END Tree draw

Tree.prototype.addBranches = function (args, hor, parentLeft, count, level) {
  const list = []

  let i = Math.floor(count)

  const step = (1 / i) * this.minFoliagePos

  let left = true

  const thisZ = level === 1 || this.getRandom() < 0.2 ? 'Front' : 'Back'

  const strip = {
    stripes: {
      random: { r: -0.5 },
      strip: this.leaveX,
      change: { r: this.leaveChange },
      seed: this.nr + count + level,
      cut: true,
    },
  }

  const leaves = [
    // Shadow of Leaves
    {
      save: 'leavesShadow' + thisZ + this.code,
      sY: { r: 2, min: 5 },
      list: [strip],
    },

    // Leaves
    {
      save: 'leaves' + thisZ + this.code,
      sY: { r: 1.5, min: 3 },
      list: [strip],
    },

    // Top of Leaves
    {
      save: 'leaves' + thisZ + this.code,
      tY: true,
      sY: { r: 0.1, min: 1 },
      list: [
        {
          fY: true,
          stripes: {
            strip: this.leaveX,
            random: { r: -1 },
            change: { r: this.leaveChange * 5 },
            cut: true,
          },
        },
      ],
    },
  ]

  list.push({
    list: [
      // Branches
      {},

      // Leaves
      level < 3 && {
        sX: hor ? args.foliageSX : args.foliageSY,
        sY: !hor ? args.foliageSX : args.foliageSY,
        cX: true,
        rotate: !hor ? 90 : 0,
        fY: !hor || (level >= 3 && hor),
        y: mult(-0.3, !hor ? args.foliageSX : args.foliageSY),
        rY: !parentLeft,
        list: [
          { sX: { r: 0.5, a: this.leaveX }, list: leaves },
          {
            sX: { r: 0.5, a: this.leaveX },
            fX: true,
            rX: true,
            list: leaves,
          },
        ],
      },
    ],
  })

  if (i > 0 && level <= 3) {
    while (i--) {
      list.push({
        sX: {
          r:
            this.getRandom() *
            this.shorter *
            (!hor ? this.horFactor : 1) *
            (level === 1 ? this.minFoliagePos + 0.2 : 1),
          otherDim: true,
          min: 1,
        },
        sY: { r: this.thinner, otherDim: true, min: 1 },
      })

      list.push({
        y: { r: step * (i + 1) },
        sX: {
          r:
            this.getRandom() *
            this.shorter *
            (!hor ? this.horFactor : 1) *
            (level === 1 ? this.minFoliagePos + 0.2 : 1),
          otherDim: true,
          min: 1,
        },
        sY: { r: this.thinner, otherDim: true, min: 1 },
        fX: left,
        tX: true,
        rY:
          (hor && ((!parentLeft && !left) || (parentLeft && left))) ||
          (!hor && ((parentLeft && !left) || (!parentLeft && left))),
        rotate: 90,
        list: this.addBranches(args, !hor, left, count - 1.5, level + 1),
      })

      left = !left
    }
  }

  return list
}

Tree.prototype.getRandom = function () {
  this.randomCount += 1

  if (this.randomCount > this.random.length) {
    this.randomCount = 0
  }

  return this.random[this.randomCount]
}

export default Tree
