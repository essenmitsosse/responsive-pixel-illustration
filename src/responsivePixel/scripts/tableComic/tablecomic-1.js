/* global TableComic */

// BEGINN getStrip /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.getStrip = function getStrip() {
  const stripInfo = new this.getStripInfo()
  const basicPanels = stripInfo.panels
  const { length } = basicPanels
  let count = 0
  let currentPanel
  const finalPanels = []
  const combiner = this.getCombiner(
    finalPanels,
    stripInfo.defaultPanels,
    stripInfo.inventory,
  )

  while (count < length) {
    currentPanel = basicPanels[count]

    if (currentPanel.draw === 'faceDraw') {
      finalPanels.push(currentPanel)
    } else {
      combiner(currentPanel)
    }

    count += 1
  }

  return stripInfo
}

TableComic.prototype.getCombiner = function (finals, defaults, inventory) {
  return function (panel) {
    const panelList = panel.list || {}
    const newList = []
    let objectKey
    let listKey
    let defaultsList
    var copyDefaultObject = function (object, defaultObject) {
      let valueKey

      if (object === undefined) {
        // If no Info exist about Object, that is supposed to be there
        return defaultObject
      } // If Info already exists about that object
      for (valueKey in defaultObject) {
        if (object[valueKey] === undefined || valueKey === 'body') {
          // If no value exists, use default value
          if (defaultObject[valueKey].map !== undefined) {
            object[valueKey] = defaultObject[valueKey]
          } else {
            object[valueKey] = copyDefaultObject(
              object[valueKey],
              defaultObject[valueKey],
            )
          }
        }
      }

      return object
    }

    for (objectKey in defaults) {
      if (objectKey === 'list') {
        if (!panel.noDefaults) {
          defaultsList = defaults[objectKey]

          // fill the List with the defaults, needs special treatment
          // Use Default values if current has no values or not all important values are defined
          for (listKey in defaultsList) {
            panelList[listKey] = copyDefaultObject(
              panelList[listKey],
              defaultsList[listKey],
            )

            newList.push(panelList[listKey])
          }
        } else {
          for (listKey in panelList) {
            newList.push(panelList[listKey])
          }
        }
      } else {
        // Fill the rest of the panel Information with defaults
        panel[objectKey] = panel[objectKey] || defaults[objectKey]
      }
    }

    // Transform to finals form, so it can be used
    for (objectKey in panelList) {
      panelList[objectKey].what = inventory[objectKey]
    }

    panel.list = newList

    finals.push(panel)
  }
}

TableComic.prototype.getStripInfo = function () {
  const background = new this.basic.Background({})

  const basicPanel = new this.basic.Panel({
    background,
  })

  const ratio = 1.3

  const furnitureColor = [30, 50, 50]

  const stage = new this.basic.Stage({
    // show: true
  })

  const actor1 = new this.basic.Actor({
    color: [this.rFl(0, 255), this.rFl(0, 255), this.rFl(0, 255)],
    firstColor: [this.rFl(0, 255), this.rFl(0, 255), this.rFl(0, 255)],
    secondColor: [this.rFl(0, 255), this.rFl(0, 255), this.rFl(0, 255)],
  })

  const actor2 = new this.basic.Actor({
    color: [this.rFl(0, 255), this.rFl(0, 255), this.rFl(0, 255)],
    firstColor: [this.rFl(0, 255), this.rFl(0, 255), this.rFl(0, 255)],
    secondColor: [this.rFl(0, 255), this.rFl(0, 255), this.rFl(0, 255)],
    body: {
      torso: {
        arm: {
          shortSleaves: true,
        },
      },
    },
  })

  const table = new this.basic.Table({
    color: furnitureColor,
    sX: 0.6,
    colorTop: [70, 90, 80],
  })
  const chair1 = new this.basic.Chair({ color: furnitureColor })
  const chair2 = new this.basic.Chair({
    color: furnitureColor,
    toLeft: true,
  })
  const glass = new this.basic.Glass({
    color: [this.rFl(0, 255), this.rFl(0, 255), this.rFl(0, 255)],
  })

  const emotion1 = new this.basic.Emotion({})
  const emotion2 = new this.basic.Emotion({})

  const noCameraMovement = false

  const getZoom = (function () {
    let min = 1
    let max = min
    const zoomIn = 0.04
    let i = 0

    return function () {
      const zoom = { map: 0, min, max }

      if (i > 0) {
        // min += zoomOut;
        max += zoomIn

        if (i === 4) {
          min += 0.2
          max += 0.2
        }
      }

      i += 1

      return noCameraMovement ? (zoom.max + zoom.min) / 2 : zoom
    }
  })()
  const panY = [
    -0.15, // 0
    { map: 0, min: -0.15, max: -0.18 }, // 1
    { map: 0, min: -0.15, max: -0.21 }, // 2
    { map: 0, min: -0.15, max: -0.25 }, // 3
    { map: 0, min: -0.15, max: -0.275 }, // 4
    { map: 0, min: 0.1, max: 0.1 }, // 5
  ]
  const panX = [
    0, // 0
    0, // 1
    0, // 2
    0, // 3
    0, // 4
    noCameraMovement ? 0.2 : { map: 0, min: 0.4, max: 0.5 }, // 5
  ]

  const actor1PosRel = 0.1
  const actor2PosRel = 0.85

  const chair1basic = {
    pos: {
      obj: stage,
      posX: actor1PosRel,
    },
  }

  const chair2basic = {
    pos: {
      obj: stage,
      posX: actor2PosRel,
    },
  }

  const actor2standing = {
    obj: stage,
    posX: actor2PosRel,
    posY: 0,
  }

  const chair1FallenOver = {
    rotate: -90,
    pos: { obj: stage, posX: -0.3 },
  }

  const chair2FallenOver = {
    rotate: 90,
    pos: { obj: stage, posX: 1.4, posY: 0 },
  }

  const tableOnGround = {
    z: 0,
    pos: {
      obj: stage,
      posX: 1,
    },
    rotate: 90,
  }

  const glassBasic = {
    z: 11000,
    level: { map: 0, min: 0.15, max: 0.75 },
    pos: {
      obj: table,
      posX: 0.8,
      posY: 1,
    },
  }

  const glassFallenOver = {
    rotate: 90,
    pos: {
      obj: table,
      posX: 0.95,
      posY: 1,
    },
    level: 0,
  }

  const glassOnGround = {
    pos: {
      obj: stage,
      posX: -0.7,
      posY: 0.1,
    },
    level: 0,
    rotate: -90,
  }

  const panels = [
    {
      // - - - - - - - - - - - -  0
      zoom: getZoom(),
      panY: panY[0],
      panX: panX[0],
      panXrel: 0.9,
      panYrel: 0.3,
      list: {
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          eyeLeft: {
            pupilPosXrel: 0.8,
          },
          eyeRight: {
            pupilPosXrel: 0.2,
          },
          mouth: {
            sY: 0.3,
            sX: 0.4,
          },
          body: {
            side: 0.2,
          },
          armLeft: {
            upperArmAngle: -0.2,
            lowerArmAngle: 0.6,
            handAngle: -0.2,
          },
          armRight: {
            upperArmAngle: 0.1,
            lowerArmAngle: 0.4,
          },
          sitting: true,
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          eyeLeft: {
            pupilPosXrel: 0.2,
          },
          eyeRight: {
            pupilPosXrel: 0.8,
          },
          mouth: {
            sY: 0,
            sX: 0.5,
          },
          body: {
            side: -0.1,
          },
          armLeft: {
            upperArmAngle: 0.2,
            lowerArmAngle: -0.8,
            handAngle: -0.2,
          },
          armRight: {
            upperArmAngle: 0.1,
            lowerArmAngle: 0.6,
            handAngle: -0.2,
          },
          handLeft: {
            obj: table,
            posY: 1,
            posX: 0.7,
          },
          handRight: {
            obj: table,
            posY: 1,
            posX: 0.9,
          },
          // body: {
          // 	side: { map: 0, min: -1, max: 1 },
          // 	lean: { map: 1, min: -1, max: 1 }
          // },
          sitting: true,
        },
      },
    },
    {
      // - - - - - - - - - - - -  1
      zoom: getZoom(),
      panY: panY[1],
      panX: panX[1],
      panYrel: 0.3,
      list: {
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          eyeLeft: {
            pupilPosXrel: 0,
          },
          eyeRight: {
            pupilPosXrel: 0.8,
          },
          mouth: {
            sY: 0,
            sX: 0.8,
          },
          body: {
            side: 0.2,
          },
          armLeft: {
            upperArmAngle: -0.2,
            lowerArmAngle: 0.6,
            handAngle: -0.2,
          },
          armRight: {
            upperArmAngle: 0.1,
            lowerArmAngle: 0.4,
          },
          sitting: true,
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          eyeLeft: {
            pupilPosXrel: 0.8,
            eyeBrowMove: { map: 0, min: -0.2, max: 0.2 },
          },
          eyeRight: {
            pupilPosXrel: 0.2,
          },
          mouth: {
            sY: 0.2,
            sX: 0.5,
          },
          body: {
            side: -0.1,
          },
          armLeft: {
            upperArmAngle: 0.2,
            lowerArmAngle: -0.8,
            handAngle: -0.2,
          },
          armRight: {
            upperArmAngle: 0.1,
            lowerArmAngle: 0.6,
            handAngle: -0.2,
          },
          // body: {
          // 	side: { map: 0, min: -1, max: 1 },
          // 	lean: { map: 1, min: -1, max: 1 }
          // },
          sitting: true,
        },
      },
    },
    {
      // - - - - - - - - - - - -  2
      zoom: getZoom(),
      panY: panY[2],
      panX: panX[2],
      panYrel: 0.3,
      list: {
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          eyes: {
            eyeBrowMove: { map: 0, min: -0.3, max: 0.3 },
            a: true,
          },
          mouth: {
            sY: 0.5,
            curveSY: { map: 0, min: -0.2, max: 0.2 },
            sX: 0.8,
          },
          armLeft: {
            upperArmAngle: -0.1,
            lowerArmAngle: 0.6,
            handAngle: -0.2,
          },
          armRight: {
            upperArmAngle: -0.4,
            lowerArmAngle: 0.85,
          },
          sitting: true,
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          eyes: {
            eyeBrowMove: { map: 0, min: -0.5, max: 0.5 },
            a: true,
          },
          mouth: {
            sY: { map: 0, min: 0.5, max: 0.25 },
            curveSY: { map: 0, min: -0.3, max: 0.3 },
            sX: 0.9,
            teethBottomSY: { map: 0, min: 0, max: 0.4 },
          },
          armLeft: {
            upperArmAngle: 0.2,
            lowerArmAngle: -0.8,
            handAngle: -0.2,
          },
          armRight: {
            upperArmAngle: 0.12,
            lowerArmAngle: 0.5,
            handAngle: -0.2,
          },
          sitting: true,
        },
        emotion1: {
          pos: {
            obj: actor1,
            posY: 0.95,
            posX: 1.5,
          },
        },
        emotion2: {
          pos: {
            obj: actor2,
            posY: 0.95,
            posX: -0.5,
          },
          right: true,
        },
      },
    },
    {
      // - - - - - - - - - - - - - - - - - - - - - - - -  3 // standing up / in love
      zoom: getZoom(),
      panY: panY[3],
      panX: panX[3],
      panYrel: 0.3,
      list: {
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          eyes: {
            eyeBrowMove: { map: 0, min: -0.7, max: 0.6 },
            a: true,
          },
          mouth: {
            sY: 0.5,
            posY: { map: 0, min: 1, max: 0 },
            curveSY: { map: 0, min: -0.7, max: 0.7 },
            sX: { map: 0, min: 0.3, max: 1 },
            teethTopSY: { map: 0, min: 0.3, max: 1 },
            teethBottomSY: { map: 0, min: 0.3, max: 1 },
          },
          body: {
            lean: { map: 0, min: -0.2, max: 0.3 },
          },
          armLeft: {
            upperArmAngle: { map: 0, min: 0.3, max: -0.1 },
            lowerArmAngle: { map: 0, min: 0.5, max: 0.6 },
            handAngle: -0.2,
          },
          armRight: {
            upperArmAngle: -0.4,
            lowerArmAngle: 0.85,
          },
          sitting: true,
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          eyes: {
            eyeBrowMove: { map: 0, min: -0.3, max: 0.3 },
            a: true,
          },
          mouth: {
            sY: { map: 0, min: 0, max: 0.4 },
            curveSY: { map: 0, min: -0.6, max: 1 },
          },
          body: {
            lean: { map: 0, min: -0.2, max: 0.3 },
            side: { map: 0, max: -0.5, min: 0 },
          },
          armLeft: {
            upperArmAngle: -0.2,
            lowerArmAngle: -0.18,
            handAngle: -0.1,
          },
          armRight: {
            upperArmAngle: 0.12,
            lowerArmAngle: 0.3,
            handAngle: 0.2,
          },
          pos: actor2standing,
        },
        glass: glassFallenOver,
        chair2: chair2FallenOver,
        emotion1: {
          pos: {
            obj: actor1,
            posY: 1,
            posX: 0.7,
          },
          heart: true,
        },
        emotion2: {
          pos: {
            obj: actor2,
            posY: 1.08,
            posX: 0.5,
          },
          heart: true,
          thunder: true,
          right: true,
        },
      },
    },
    {
      // - - - - - - - - - - - - - - - - - - - - - - - -  4 // ex-on the table
      zoom: getZoom(),
      panY: panY[4],
      panX: panX[4],
      panYrel: 0.3,
      list: {
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          eyes: {
            eyeBrowMove: { map: 0, min: -1, max: 0.8 },
            a: true,
          },
          mouth: {
            sY: { map: 0, min: 1, max: 0 },
            curveSY: { map: 0, min: -0.7, max: 0.7 },
            sX: { map: 0, min: 1, max: 0.3 },
          },
          body: {
            lean: { map: 0, min: -0.3, max: 0.5 },
          },
          armLeft: {
            upperArmAngle: { map: 0, min: -0.7, max: 0.4 },
            lowerArmAngle: { map: 0, min: -0.3, max: 0.2 },
            handAngle: -0.2,
          },
          armRight: {
            upperArmAngle: { map: 0, min: -0.8, max: -0.2 },
            lowerArmAngle: { map: 0, min: -0.3, max: -0.5 },
            handAngle: -0.2,
            z: -1000,
          },
          pos: {
            obj: stage,
            posX: actor1PosRel + 0.2,
            posY: 0,
          },
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          eyes: {
            eyeBrowMove: { map: 0, min: -1, max: 0.8 },
            pupilS: { map: 0, min: 0.8, max: 1 },
            a: true,
          },
          body: {
            lean: { map: 0, min: -0.3, max: 0.5 },
          },
          mouth: {
            sY: { map: 0, min: 1, max: 0 },
            curveSY: { map: 0, min: -0.7, max: 0.7 },
            sX: { map: 0, min: 0.3, max: 1 },
          },
          armLeft: {
            upperArmAngle: { map: 0, max: -0.3, min: -0.3 },
            lowerArmAngle: { map: 0, max: -0.2, min: -0.5 },
            handAngle: { map: 0, min: -0.3, max: -0.1 },
            z: -1100,
          },
          armRight: {
            upperArmAngle: { map: 0, max: 0.5, min: -0.2 },
            lowerArmAngle: { map: 0, max: 0.1, min: -0.4 },
            handAngle: { map: 0, min: -0.5, max: -0.1 },
          },
          pos: actor2standing,
        },
        chair1: chair1FallenOver,
        chair2: chair2FallenOver,
        glass: glassFallenOver,
      },
    },
    {
      // - - - - - - - - - - - - - - - - - - - - - - - -  5 // on the ground
      zoom: getZoom(),
      panY: panY[5],
      panX: panX[5],
      panYrel: 0.3,
      list: {
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          eyes: {
            eyeBrowMove: { map: 0, min: 0.5, max: 0.8 },
            pupilPosXrel: { map: 0, min: 0.5, max: 0 },
            pupilPosYrel: { map: 0, min: 0.5, max: 0 },
            pupilS: { map: 0, min: 0.1, max: 1 },
            openSY: { map: 0, min: 2, max: 1 },
            a: true,
          },
          mouth: {
            sY: { map: 0, min: 1, max: 0 },
            posY: { map: 0, min: 1, max: 0 },
            curveSY: { map: 0, min: -1, max: 0.7 },
            sX: { map: 0, min: 1, max: 0.1 },
            teethBottomSY: { map: 0, min: 1, max: 0 },
          },
          armLeft: {
            upperArmAngle: { map: 0, min: 1.3, max: 0.2 },
            lowerArmAngle: { map: 0, min: -0.3, max: 0.5 },
            handAngle: -0.2,
            z: 10000,
          },
          armRight: {
            upperArmAngle: { map: 0, min: -0.8, max: -0.2 },
            lowerArmAngle: { map: 0, min: -0.3, max: -0.6 },
            handAngle: -0.2,
          },
          pos: {
            obj: stage,
            posX: 0.5,
            posY: 0,
          },
          body: {
            side: { map: 0, min: 0.2, max: 1 },
          },
          rotate: -90,
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          eyes: {
            eyeBrowMove: { map: 0, min: -1, max: 0.8 },
            pupilS: 1,
            a: true,
          },
          mouth: {
            sY: { map: 0, min: 1, max: 0 },
            curveSY: { map: 0, min: -0.7, max: 0.7 },
            sX: { map: 0, min: 1, max: 0.3 },

            teethTopSY: { map: 0, min: 1, max: 0 },
            teethBottomSY: { map: 0, min: 1, max: 0.2 },
          },
          body: {
            side: -1,
            lean: { map: 0, max: 0.1, min: -0.2 },
          },
          armLeft: {
            upperArmAngle: -0.5,
            lowerArmAngle: 0,
            handAngle: -0.2,
            z: -11000000,
          },
          armRight: {
            upperArmAngle: { map: 0, min: 0.5, max: 0.3 },
            lowerArmAngle: { map: 0, min: 0, max: 0.2 },
            handAngle: { map: 0, min: 0, max: -0.2 },
          },
          bendLeg: true,
          rotate: -90,
          pos: {
            obj: actor1,
            posX: 0,
            posY: 1,
          },
        },
        chair1: chair2FallenOver,
        chair2: chair2FallenOver,
        table: tableOnGround,
        glass: glassOnGround,
      },
    },
    {
      // - - - - - - - - - - - -  6 // BIG FACE
      // zoomTo: actor1,
      zoom: { map: 1, min: 0.8, max: 1.1 },
      noDefaults: true,
      backgroundInfo: {
        zoom: { map: 1, min: 2, max: 0.5 },
      },
      list: {
        stage: {},
        actor2: {
          zoomToHead: true,
          pos: {
            obj: stage,
            posX: 0.5,
          },
          body: {
            side: { map: 1, max: 0.2, min: -0.2 },
          },
          eyeLeft: {
            eyeBrowMove: { map: 1, max: 0.5, min: 0.3 },
            pupilPosX: { map: 1, max: -0.2, min: 0 },
            pupilPosY: { map: 1, max: -0.2, min: 0 },
            pupilPosXrel: { map: 1, max: 0, min: 0.4 },
            pupilPosYrel: { map: 1, max: 0, min: 0.5 },
            pupilS: { map: 1, max: 1, min: 0.25 },
            openSY: { map: 1, max: 1, min: 0.8 },
            sY: { map: 1, max: 1, min: 2 },
          },
          eyeRight: {
            eyeBrowMove: { map: 1, max: -0, min: 0.3 },
            pupilPosX: { map: 1, max: -0.2, min: 0 },
            pupilPosY: { map: 1, max: -0.2, min: 0 },
            pupilPosXrel: { map: 1, max: 0, min: 0.4 },
            pupilPosYrel: { map: 1, max: 0, min: 0.5 },
            pupilS: { map: 1, max: 1, min: 0.25 },
            openSY: { map: 1, max: 0.9, min: 1 },
            sY: { map: 1, max: 0.5, min: 2 },
          },
          mouth: {
            posY: { map: 1, max: 0.2, min: 0.5 },
            sY: { map: 1, max: 0.4, min: 0.5 },
            curveSY: { map: 1, max: 0.5, min: -1 },
            teethTopSY: { map: 1, max: 1, min: 0 },
            teethBottomSY: { map: 1, max: 1, min: 0.2 },
          },
          armLeft: {
            upperArmAngle: { map: 1, min: -0.7, max: -0.2 },
            lowerArmAngle: { map: 1, min: -0.3, max: -0.2 },
            handAngle: { map: 1, min: -0.2, max: 0.5 },
          },
          armRight: {
            upperArmAngle: { map: 1, min: -0.8, max: 0 },
            lowerArmAngle: { map: 1, min: -0.3, max: 0 },
            handAngle: { map: 1, min: -0.3, max: 0.2 },
          },
        },
      },
    },
    {
      // - - - - - - - - - - - -  7 // DIEING
      // noDefaults: true,
      zoom: { map: 1, max: 0.5, min: 1.1 },
      noDefaults: true,
      background: background.floor,
      list: {
        stage: {},
        actor1: {
          zoomToHead: true,
          body: {
            side: { map: 1, min: -0.6, max: 0 },
          },
          pos: {
            obj: stage,
            posX: 0.5,
          },
          eyeLeft: {
            openSY: { map: 1, max: 0.2, min: 0.1 },
            sY: { map: 1, max: 1, min: 0.8 },

            pupilPosXrel: { map: 1, max: 0, min: 1 },
            pupilPosY: { map: 1, max: 0, min: -0.65 },
          },
          eyeRight: {
            openSY: { map: 1, max: 0.2, min: 0.5 },
            sY: { map: 1, max: 1, min: 0.8 },
            pupilPosXrel: { map: 1, max: 0, min: 0.6 },
            pupilPosYrel: { map: 1, max: 0, min: 0.5 },
            pupilPosY: { map: 1, max: 0, min: 0.5 },
          },
          mouth: {
            sY: { map: 1, max: 0, min: 0.3 },
            curveSY: { map: 1, max: 1, min: -0.75 },
          },
          armLeft: {
            upperArmAngle: -0.6,
            lowerArmAngle: -0.2,
            handAngle: -0.3,
          },
          armRight: {
            upperArmAngle: -0.4,
            lowerArmAngle: -0.4,
            handAngle: -0.1,
          },
        },
      },
    },
    {
      // - - - - - - - - - - - -  8
      zoom: 0.6,
      panY: 0.2,
      list: {
        actor1: {
          body: {
            side: { map: 1, min: 0.2, max: 1 },
          },
          eyeLeft: {
            openSY: { map: 1, max: 0.2, min: 0.1 },
            sY: { map: 1, max: 1, min: 0.8 },

            pupilPosXrel: { map: 1, max: 0, min: 1 },
            pupilPosY: { map: 1, max: 0, min: -0.65 },
          },
          eyeRight: {
            openSY: { map: 1, max: 0.2, min: 0.5 },
            sY: { map: 1, max: 1, min: 0.8 },
            pupilPosXrel: { map: 1, max: 0, min: 0.6 },
            pupilPosYrel: { map: 1, max: 0, min: 0.5 },
            pupilPosY: { map: 1, max: 0, min: 0.5 },
          },
          mouth: {
            sY: { map: 1, max: 0, min: 0.3 },
            curveSY: { map: 1, max: 1, min: -0.75 },
          },
          pos: {
            obj: stage,
            posX: 0.5,
            posY: -0.1,
          },
          armLeft: {
            upperArmAngle: -0.8,
            lowerArmAngle: -0.2,
            handAngle: -0.3,
          },
          armRight: {
            upperArmAngle: -0.9,
            lowerArmAngle: -0.4,
            handAngle: -0.1,
            z: -100,
          },
          rotate: -90,
        },

        actor2: {
          body: {
            side: 1,
          },
          eyeLeft: {
            openSY: 1,
            sY: 1.2,
            pupilPosY: 0.5,
          },
          mouth: {
            sX: 0,
          },
          pos: {
            obj: stage,
            posX: 1.3,
            posY: -0.3,
          },
          armLeft: {
            upperArmAngle: -0.3,
            lowerArmAngle: 0.3,
            handAngle: 0.3,
          },
          armRight: {
            upperArmAngle: -0.3,
            lowerArmAngle: -0.4,
            handAngle: -0.1,
            z: -100,
          },
          z: 100,
        },

        table: tableOnGround,
        chair1: chair1FallenOver,
        chair2: chair2FallenOver,
        glass: glassOnGround,
      },
    },
  ]

  return {
    paperColor: [220, 220, 220],
    roundTopCorners: true,
    basicPanel,
    ratio,
    inventory: {
      stage,

      actor1,
      actor2,

      table,
      chair1,
      chair2,

      glass,

      emotion1,
      emotion2,
    },
    defaultPanels: {
      background,
      list: {
        stage: {},
        chair1: chair1basic,
        chair2: chair2basic,
        table: {
          z: 10000,
          pos: {
            obj: stage,
            posX: 0.5,
          },
        },
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          z: 2000,
          body: {
            side: 0.5,
          },
          pos: {
            obj: chair1,
            posX: 0,
            posY: 1,
          },
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          z: 3000,
          body: {
            side: -0.5,
          },
          pos: {
            obj: chair2,
            posX: 1,
            posY: 1,
          },
        },
        glass: glassBasic,
        emotion1: {
          pos: { obj: stage, posY: -10 },
        },
        emotion2: {
          pos: { obj: stage, posY: -10 },
        },
      },
    },
    panels,
  }
}
// END getStrip \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
