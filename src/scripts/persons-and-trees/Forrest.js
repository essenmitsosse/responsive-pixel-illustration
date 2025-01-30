import Object from './Object'

const Forrest = function () {
  let i = (this.treeKindsCount = this.IF(0.8) ? 1 : this.IF(0.8) ? 2 : 3)
  // trees,
  let family
  let count

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

Forrest.prototype = new Object()

Forrest.prototype.draw = function (args, z, size) {
  const list = []

  let i = this.treeCount
  let thisTree

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

export default Forrest
