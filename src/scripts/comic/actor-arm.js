// BEGINN Arm /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Arm = function Arm(args) {
  this.actor = args.actor

  // Forms
  this.shortSleaves = args.info.shortSleaves

  this.armBaseSY_ = 1.3

  this.armRelSY_ = this.rFl(0.5, 1.5)

  // Sizes
  this.armRatio = this.rFl(0.35, 0.7) && 0.5

  // Colors
  this.skinColor = this.actor.colors.skinColor

  this.color = this.actor.colors.color1

  this.upperArmColor = this.noSleaves ? this.skinColor : this.color

  this.lowerArmColor = this.shortSleaves ? this.skinColor : this.color
}

Arm.prototype.draw = function ArmDraw(args) {
  const armSY = this.getSizeSwitch(
    { r: this.armBaseSY_, useSize: args.torsoSY },
    { r: this.armRelSY_ },
    {
      min: { r: 1, useSize: args.torsoSX },
      max: { r: 0.8, useSize: this.actor.bodySY },
    },
    'actor-features',
  )

  const armS = (this.armS = this.pushLinkList({
    r: 0.08,
    useSize: armSY,
    min: 1,
  }))

  const upperArmS = this.pushLinkList({ r: 0.1, useSize: armSY, min: 1 })

  const armSHalf = (this.armSHalf = this.pushLinkList({
    r: 0.5,
    useSize: upperArmS,
    a: -1,
  }))

  const handS = (this.handS = this.pushLinkList({
    r: 0.1,
    useSize: armSY,
    min: 1,
  }))

  const handSY = this.pushLinkList({ r: 0.14, useSize: armSY, min: 1 })

  this.right = args.right

  this.isRotated = this.actor.isRotated

  this.x = this.pushLinkList({
    add: [
      args.right ? { r: -1, useSize: args.x } : args.x,
      !args.right ? { r: -1, useSize: armSHalf } : armSHalf,
      args.right ? 0 : -1,
      (this.isRotated ? !args.right : args.right)
        ? [{ r: -1, useSize: armSHalf }]
        : [armSHalf, 1],
      args.info.x ? { r: args.info.x, useSize: this.actor.sX } : 0,
    ],
  })

  this.y = armSHalf

  this.handHalfS = this.pushLinkList({ r: -0.5, useSize: handS })

  this.endX = this.pushLinkList({})

  this.endY = this.pushLinkList({})

  if (args.info && args.info.pos) {
    this.getMoveableTarget('target', 'getTarget', args.info.pos)
  } else {
    // Default, lowered arms
    this.targetX = this.pushLinkList({ a: 0 })

    this.targetY = armSY
  }

  if (args.info && args.info.hand) {
    this.getMoveableTarget('handTarget', 'getHandTarget', args.info.hand)
  } else {
    this.handTargetX = this.pushLinkList({ a: 0 })

    this.handTargetY = this.pushLinkList({ a: 2 })
  }

  return {
    fX: this.right,
    rX: this.right,
    x: this.x,
    y: this.y,
    s: 1,
    z: (args.info && args.info.z) || 300,
    list: [
      {
        name: 'Arm',
        lowerArmWeight: armS,
        upperArmWeight: upperArmS,
        length: armSY,
        ratio: this.armRatio,
        maxStraight: (args.info && args.info.maxStraight) || 1,

        upperArmLightColor: this.upperArmColor[0],
        upperArmColor: this.upperArmColor[1],

        lowerArmLightColor: this.lowerArmColor[0],
        lowerArmColor: this.lowerArmColor[1],

        targetX: this.targetX,
        targetY: this.targetY,

        jointX: this.pushLinkList({}),
        jointY: this.pushLinkList({}),
        endX: this.endX,
        endY: this.endY,
        flip: args.info
          ? args.info.flip
            ? this.right
            : !this.right
          : !this.right,
        debug: this.debug,
        ellbow: args.info && args.info.pos && args.info.pos.ellbow,
        hand: {
          length: handSY,
          width: handS,
          color: this.skinColor[1],
          endX: this.pushLinkList({}),
          endY: this.pushLinkList({}),

          targetX: this.handTargetX,
          targetY: this.handTargetY,
        },
      },
      {
        color: this.upperArmColor[0],
        x: 1,
        sX: [armS, 1],
        sY: armS,
      },
    ],
  }
}

Arm.prototype.getHandTarget = function (target, name) {
  const x = name + 'X'
  const y = name + 'Y'

  if (target.angle) {
    this[x] = this.pushLinkList({
      a: Math.sin(target.angle * Math.PI) * 20,
    })

    this[y] = this.pushLinkList({
      a: Math.cos(target.angle * Math.PI) * 20,
    })
  } else if (target.target) {
    this.getTarget(target.target, name)

    this[x] = this.pushLinkList({
      add: [this[x], { r: -1, useSize: this.endX }],
    })

    this[y] = this.pushLinkList({
      add: [this[y], { r: -1, useSize: this.endY }],
    })
  } else {
    this[x] = this.pushLinkList({ a: 0 })

    this[y] = this.pushLinkList({ a: 1 })
  }
}

Arm.prototype.getTarget = function (target, name) {
  const xAdd = []
  const yAdd = []

  xAdd.push(
    // Actor relative to Stage
    { r: -1, useSize: this.actor.x },
    this.isRotated ? { r: -1, useSize: this.actor.square } : 0,
    // // // get Position of Target
    target.obj.getBetterPosX
      ? target.obj.getBetterPosX(target.posX)
      : target.obj.getPosX(target.posX),
  )

  yAdd.push(
    // // Actor relative to Stage
    this.actor.y,

    // get Position of Target
    target.obj.getBetterPosY
      ? target.obj.getBetterPosY(target.posY)
      : target.obj.getPosY(target.posY),
  )

  const add = this.isRotated ? xAdd : yAdd
  const addOtherAxis = !this.isRotated ? xAdd : yAdd

  add.push({ r: -1, useSize: this.y }, this.actor.bodySY, -1)

  addOtherAxis.push(
    {
      r: (this.isRotated ? -1 : 1) * (!this.right ? -1 : 1),
      useSize: this.x,
    },
    this.right
      ? { r: this.isRotated ? 1 : -1, useSize: this.actor.body.torso.sX }
      : 0,
    !this.right ? (this.isRotated ? 1 : -1) : 0,
  )

  this[name + 'X'] = this.pushLinkList({ add: xAdd })

  this[name + 'Y'] = this.pushLinkList({ add: yAdd })
}

Arm.prototype.getMoveableTarget = function (name, targetFunc, info) {
  const mainX = name + 'X'
  const mainY = name + 'Y'
  const moveXName = name + 'moveX'
  const moveYName = name + 'moveY'
  const pushRelativeStandardAutomaticObject = {}

  if (info.map !== undefined) {
    this[targetFunc](info.max, name)

    // If there are two targets, create an animation between the two
    this[targetFunc](info.min, name + 'Alt')

    this[moveXName] = this.pushLinkList({
      r: 0,
      useSize: this.pushLinkList({
        add: [this[name + 'AltX'], { r: -1, useSize: this[mainX] }],
      }),
    })

    this[moveYName] = this.pushLinkList({
      r: 0,
      useSize: this.pushLinkList({
        add: [this[name + 'AltY'], { r: -1, useSize: this[mainY] }],
      }),
    })

    pushRelativeStandardAutomaticObject[moveXName] = {
      map: info.map,
      min: 0,
      max: 1,
    }

    pushRelativeStandardAutomaticObject[moveYName] = {
      map: info.map,
      min: 0,
      max: 1,
    }

    this.hoverChangerStandard.pushAutomatic(
      this,
      pushRelativeStandardAutomaticObject,
    )

    this[mainX] = this.pushLinkList({
      add: [this[mainX], this[moveXName]],
    })

    this[mainY] = this.pushLinkList({
      add: [this[mainY], this[moveYName]],
    })
  } else {
    this[targetFunc](info, name)
  }
}
// END Arm \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
