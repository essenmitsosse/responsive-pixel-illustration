import { Object } from './object.js'

// TREE FAMILY
export const TreeFamily = function (args) {
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

// TREE
export const Tree = function (args) {
  if (!args) {
    args = args || {}
  }

  this.zInd = 1000

  for (var attr in args) {
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
  var code = (this.code = this.id + '_' + (this.nr += 1))
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
                      sY: [args.treeSqu, this.sub(args.topTrunk)],
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
  var list = [],
    i = Math.floor(count),
    step = (1 / i) * this.minFoliagePos,
    left = true,
    thisZ = level === 1 || this.getRandom() < 0.2 ? 'Front' : 'Back',
    strip = {
      stripes: {
        random: { r: -0.5 },
        strip: this.leaveX,
        change: { r: this.leaveChange },
        seed: this.nr + count + level,
        cut: true,
      },
    },
    code = this.code,
    leaves = [
      // Shadow of Leaves
      {
        save: 'leavesShadow' + thisZ + code,
        sY: { r: 2, min: 5 },
        list: [strip],
      },

      // Leaves
      {
        save: 'leaves' + thisZ + code,
        sY: { r: 1.5, min: 3 },
        list: [strip],
      },

      // Top of Leaves
      {
        save: 'leaves' + thisZ + code,
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
        y: this.mult(-0.3, !hor ? args.foliageSX : args.foliageSY),
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

// FORREST
export const Forrest = function () {
  var i = (this.treeKindsCount = this.IF(0.8) ? 1 : this.IF(0.8) ? 2 : 3),
    // trees,
    family,
    count

  this.trees = []

  while (i--) {
    count = this.GR(1, 6 - this.treeKindsCount)

    family = new this.basic.TreeFamily({
      color: this.groundColor,
      secondColor: this.skyColor,
    })

    while (count--) {
      this.trees.push({
        x: this.R(0, 1),
        tree: new this.basic.Tree(family),
      })
    }
  }

  this.treeCount = this.trees.length
}

// END Forrest
Forrest.prototype = new Object()

Forrest.prototype.draw = function (args, z, size) {
  var list = [],
    i = this.treeCount,
    thisTree

  while (i--) {
    thisTree = this.trees[i]

    list.push({
      x: { r: thisTree.x },
      s: size,
      list: thisTree.tree.draw(args, z, size),
    })
  }

  return [
    {
      z,
      sY: size,
      sX: { r: 4, useSize: size },
      cX: true,
      list,
    },
  ]
}
