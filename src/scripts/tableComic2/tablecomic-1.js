// BEGINN getStrip /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const getFace = function () {
  let backgroundColor = [0, 0, 0]
  let that = this

  let getPanel = function () {
    let actor = new this.basic.Actor({
      color: [that.rInt(0, 255), that.rInt(0, 255), that.rInt(0, 255)],
    })
    let pupilS = { map: 'c', min: 0.5, max: 0.8 }
    let pupilPosY = { map: 'a', min: 0, max: 1 }
    let openSY = { map: 'd', min: 0, max: 1 }

    return {
      camera: {
        zoom: 0.2,
      },
      list: [
        {
          what: new this.basic.Stage(),
        },
        {
          what: new this.basic.Head({
            actor,
            baseSX_: 1,
            noHat: true,
          }),
          side: that.rIf(0.5)
            ? { map: 'side', min: -0.5, max: 0.5 }
            : { map: 'side', min: 0.5, max: -0.5 },
          eyeLeft: {
            openSY,
            sY: { map: 'e', min: 0.3, max: 1 },
            pupilS,
            pupilPosXrel: { map: 'b', min: -0, max: 1 },
            pupilPosYrel: pupilPosY,
            eyeBrowMove: { map: 'g', max: -0.5, min: 0.5 },
          },
          eyeRight: {
            openSY,
            sY: { map: 'f', min: 0.3, max: 1 },
            pupilS,
            pupilPosXrel: { map: 'b', max: -0, min: 1 },
            pupilPosYrel: pupilPosY,
            eyeBrowMove: { map: 'h', max: -0.5, min: 0.5 },
          },
          mouth: {
            sY: { map: 'i', min: 0, max: 1 },
            posY: { map: 'j', min: 0, max: 1 },
            curveSY: { map: 'k', min: -1, max: 1 },
            sX: { map: 'l', min: 0, max: 1 },
            teethTopSY: { map: 'm', min: 0, max: 1 },
            teethBottomSY: { map: 'n', min: 0, max: 1 },
          },
        },
      ],
    }
  }

  return {
    paperColor: backgroundColor,
    ratio: 1,
    basicPanel: this.panel,
    background: new this.basic.Background({
      blank: true,
      backgroundColor,
    }),
    panels: [
      getPanel(),
      // getPanel(),
      // getPanel(),
      // getPanel()
    ],
  }
}

export const getStrip = function getStrip() {
  let stripInfo = new this.getStripInfo()
  let basicPanels = stripInfo.panels
  let count = 0
  let currentPanel
  let finalPanels = []
  let combiner = this.getCombiner(
    finalPanels,
    stripInfo.defaultPanels,
    stripInfo.inventory,
  )

  while (count < basicPanels.length) {
    currentPanel = basicPanels[count]

    if (currentPanel.draw === 'faceDraw') {
      finalPanels.push(currentPanel)
    } else {
      combiner(currentPanel)
    }

    count += 1
  }

  delete stripInfo.defaultPanels

  delete stripInfo.inventory

  return stripInfo
}

export const getCombiner = function (finals, defaults, inventory) {
  return function (panel) {
    let panelList = panel.list || {}
    let newList = []
    let objectKey
    let listKey
    let defaultsList

    let copyDefaultObject = function (object, defaultObject) {
      let valueKey

      if (object === undefined) {
        // If no Info exist about Object, that is supposed to be there
        return defaultObject
      } else {
        // If Info already exists about that object
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

export const getStripInfo = function () {
  let background = new this.basic.Background({})
  let basicPanel = new this.basic.Panel({
    background,
  })
  let ratio = 1.3
  let furnitureColor = [30, 50, 50]
  let stage = new this.basic.Stage({
    // show: true
  })
  let actorBaseColor = [this.rInt(0, 255), this.rInt(0, 255), this.rInt(0, 255)]
  let firstBaseColor = [this.rInt(0, 255), this.rInt(0, 255), this.rInt(0, 255)]
  let secondBaseColor = [
    this.rInt(0, 255),
    this.rInt(0, 255),
    this.rInt(0, 255),
  ]

  let actor1 = new this.basic.Actor({
    color: {
      map: 'actor-color',
      min: actorBaseColor,
      max: [this.rInt(0, 255), this.rInt(0, 255), this.rInt(0, 255)],
    },
    headScaling: { map: 'features', min: 1, max: this.rFl(0.2, 2) },
    firstColor: firstBaseColor,
    secondColor: secondBaseColor,
    main: true,
  })
  let actor2 = new this.basic.Actor({
    color: actorBaseColor,
    firstColor: {
      map: 'actor-color',
      min: firstBaseColor,
      max: [this.rInt(0, 255), this.rInt(0, 255), this.rInt(0, 255)],
    },
    secondColor: {
      map: 'actor-color',
      min: secondBaseColor,
      max: [this.rInt(0, 255), this.rInt(0, 255), this.rInt(0, 255)],
    },
    torso: {
      bodyScaling: {
        map: 'features',
        min: 1,
        max: this.rFl(0.5, 1.5),
      },
    },
  })
  let table = new this.basic.Table({
    color: furnitureColor,
    sX: 0.6,
    colorDetail: [70, 90, 80],
  })
  let chair1 = new this.basic.Chair({ color: furnitureColor })
  let chair2 = new this.basic.Chair({ color: furnitureColor, toLeft: true })
  let glass = new this.basic.Glass({
    color: [this.rInt(0, 255), this.rInt(0, 255), this.rInt(0, 255)],
  })
  let emotion1 = new this.basic.Emotion({})
  let emotion2 = new this.basic.Emotion({})
  let noCameraMovement = false
  let getZoom = (function () {
    let min = 1
    let max = min
    let zoomIn = 0.1
    let i = 0

    return function () {
      let zoom = { map: 'a', min, max }

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
  let panY = [
    -0.15,
    //0
    { map: 'a', min: -0.15, max: -0.18 },
    //1
    { map: 'a', min: -0.15, max: -0.21 },
    //2
    { map: 'a', min: -0.15, max: -0.25 },
    //3
    { map: 'a', min: -0.15, max: -0.275 },
    //4
    { map: 'a', min: 0.1, max: 0.1 },
    // 5
  ]
  let panX = [
    //0
    0,
    //1
    0,
    //2
    0,
    //3
    0,
    //4
    0,
    //5
    noCameraMovement ? 0.2 : { map: 'a', min: 0.3, max: 0.25 },
  ]
  let actor1PosRel = 0.1
  let actor2PosRel = 0.85
  let chair1basic = {
    pos: {
      obj: stage,
      posX: actor1PosRel,
    },
  }
  let chair2basic = {
    pos: {
      obj: stage,
      posX: actor2PosRel,
    },
  }
  let actor2standing = {
    obj: stage,
    posX: actor2PosRel,
    posY: 0,
  }
  let actor1LeftHandOnLap = {
    pos: { obj: actor1.body.legs, posX: 0.5, posY: 0.8 },
    hand: { angle: 0.5 },
  }
  let actor1RightHandOnLap = {
    pos: { obj: actor1.body.legs, posX: 0.8, posY: 1 },
    hand: { angle: -0.5 },
  }
  let actor1RightHandOnTable = {
    pos: {
      obj: table,
      posY: 1,
      ellbow: true,
    },
    hand: { angle: 0.5 },
  }
  let actor2LeftHandOnTable = {
    pos: { obj: table, posY: 1, posX: 0.5 },
    hand: { angle: -0.5 },
    flip: true,
    z: -100,
  }
  let actor2RightHandOnTable = {
    pos: {
      obj: table,
      posY: 1,
      posX: 0.8,
    },
    hand: { angle: -0.5 },
  }
  let actor1OnTheGround = { obj: table, posX: 0, posY: 1 }
  let actor1Dead = {
    body: {
      side: { map: 'b', min: 0.2, max: 1 },
    },
    pos: actor1OnTheGround,
    rotate: -90,
    eyeLeft: {
      openSY: { map: 'b', max: 0.2, min: 0.1 },
      sY: { map: 'b', max: 1, min: 0.8 },

      pupilPosXrel: { map: 'b', max: 0, min: 1 },
      pupilPosY: { map: 'b', max: 0, min: -0.65 },
    },
    eyeRight: {
      openSY: { map: 'b', max: 0.2, min: 0.5 },
      sY: { map: 'b', max: 1, min: 0.8 },
      pupilPosXrel: { map: 'b', max: 0, min: 0.6 },
      pupilPosYrel: { map: 'b', max: 0, min: 0.5 },
      pupilPosY: { map: 'b', max: 0, min: 0.5 },
    },
    mouth: {
      sY: { map: 'b', max: 0, min: 0.3 },
      curveSY: { map: 'b', max: 1, min: -0.75 },
    },
    armRight: {
      pos: { obj: actor1.head, posX: -0.5, posY: 0 },
      hand: { angle: -0.8 },
      maxStraight: 0.9,
      flip: true,
      z: -500,
    },
    armLeft: {
      pos: { obj: actor1.head, posX: 0.2, posY: -0.2 },
      hand: { angle: -0.6 },
      maxStraight: 0.9,
      flip: true,
    },
    z: 20000,
  }
  let actor2Reacts = {
    pos: {
      obj: stage,
      posX: 1,
    },
    body: {
      side: { map: 'b', max: -0.2, min: 0.2 },
    },
    eyeLeft: {
      eyeBrowMove: { map: 'b', max: 0.5, min: 0.3 },
      pupilPosX: { map: 'b', max: -0.2, min: 0 },
      pupilPosY: { map: 'b', max: -0.2, min: 0 },
      pupilPosXrel: { map: 'b', max: 0, min: 0.4 },
      pupilPosYrel: { map: 'b', max: 0, min: 0.5 },
      pupilS: { map: 'b', max: 1, min: 0.25 },
      openSY: { map: 'b', max: 1, min: 0.8 },
      sY: { map: 'b', max: 1, min: 2 },
    },
    eyeRight: {
      eyeBrowMove: { map: 'b', max: -0, min: 0.3 },
      pupilPosX: { map: 'b', max: -0.2, min: 0 },
      pupilPosY: { map: 'b', max: -0.2, min: 0 },
      pupilPosXrel: { map: 'b', max: 0, min: 0.4 },
      pupilPosYrel: { map: 'b', max: 0, min: 0.5 },
      pupilS: { map: 'b', max: 1, min: 0.25 },
      openSY: { map: 'b', max: 0.9, min: 1 },
      sY: { map: 'b', max: 0.5, min: 2 },
    },
    mouth: {
      posY: { map: 'b', max: 0.2, min: 0.5 },
      sY: { map: 'b', max: 0.4, min: 0.5 },
      curveSY: { map: 'b', max: 0.5, min: -1 },
      teethTopSY: { map: 'b', max: 1, min: 0 },
      teethBottomSY: { map: 'b', max: 1, min: 0.2 },
    },
    armRight: {
      pos: {
        map: 'b',
        min: { obj: actor2, posX: 4, posY: 0.5 },
        max: { obj: actor2.head, posX: 1.2, posY: 1.2 },
      },
      hand: {
        map: 'b',
        min: { angle: 0.8 },
        max: { angle: -0.9 },
      },
      maxStraight: 0.9,
      flip: true,
    },
    armLeft: {
      pos: {
        map: 'b',
        min: { obj: actor2, posX: -4, posY: 0.5 },
        max: { obj: actor2.head, posX: 0.1, posY: 1 },
      },
      hand: {
        map: 'b',
        min: { angle: -0.9 },
        max: { angle: 0.6 },
      },
      maxStraight: 0.9,
      flip: true,
    },
  }
  let chair1FallenOver = {
    rotate: -90,
    pos: { obj: stage, posX: -0.3, posY: 0.1 },
  }
  let chair2FallenOver = {
    rotate: 90,
    pos: { obj: stage, posX: 1.4, posY: 0.2 },
  }
  let glassBasic = {
    z: 11000,
    level: { map: 'a', min: 0.15, max: 0.75 },
    pos: { obj: table, posX: 0.8, posY: 1 },
  }
  let glassFallenOver = {
    rotate: 90,
    pos: { obj: table, posX: 0.95, posY: 1 },
    level: 0,
  }
  let glassOnGround = {
    pos: { obj: stage, posX: -0.7, posY: 0.1 },
    level: 0,
    rotate: -90,
  }
  let panels = [
    {
      // - - - - - - - - - - - -  0
      camera: {
        zoom: 0.5,
        focus: {
          map: 'a',
          min: { obj: glass, posX: 0.5, posY: 0.6 },
          max: { obj: actor1, posX: 0.5, posY: 0.5 },
        },
      },
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
          armLeft: actor1LeftHandOnLap,
          armRight: actor1RightHandOnLap,
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

          armLeft: actor2LeftHandOnTable,
          armRight: actor2RightHandOnTable,

          // body: {
          // 	side: { map: "a", min: -1, max: 1 },
          // 	lean: { map: "b", min: -1, max: 1 }
          // },
          sitting: true,
        },
      },
    },
    {
      // - - - - - - - - - - - -  1
      camera: {
        zoom: getZoom(),
        panY: panY[1],
        panX: panX[1],
        panYrel: -0.5,
      },
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

          armLeft: actor1LeftHandOnLap,
          armRight: actor1RightHandOnLap,
          sitting: true,
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          eyeLeft: {
            pupilPosXrel: 0.8,
            eyeBrowMove: { map: 'a', min: -0.2, max: 0.2 },
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
          armLeft: actor2LeftHandOnTable,
          armRight: actor2RightHandOnTable,
          // body: {
          // 	side: { map: "a", min: -1, max: 1 },
          // 	lean: { map: "b", min: -1, max: 1 }
          // },
          sitting: true,
        },
      },
    },
    {
      // - - - - - - - - - - - -  2
      camera: {
        zoom: getZoom(),
        panY: panY[2],
        panX: panX[2],
        panYrel: -0.5,
      },
      list: {
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          eyes: {
            eyeBrowMove: { map: 'a', min: -0.3, max: 0.3 },
            a: true,
          },
          mouth: {
            sY: 0.5,
            curveSY: { map: 'a', min: -0.2, max: 0.2 },
            sX: 0.8,
          },

          armLeft: actor1LeftHandOnLap,
          armRight: actor1RightHandOnTable,
          sitting: true,
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          eyes: {
            eyeBrowMove: { map: 'a', min: -0.5, max: 0.5 },
            a: true,
          },
          mouth: {
            sY: { map: 'a', min: 0.5, max: 0.25 },
            curveSY: { map: 'a', min: -0.3, max: 0.3 },
            sX: 0.9,
            teethBottomSY: { map: 'a', min: 0, max: 0.4 },
          },
          armLeft: actor2LeftHandOnTable,
          armRight: {
            pos: { obj: glass, posX: 1, posY: 0.6 },
            hand: {
              angle: -0.5,
            },
            z: 100000,
          },
          sitting: true,
        },
        emotion1: {
          pos: {
            obj: actor1,
            posY: 1,
            posX: 0,
          },
        },
        emotion2: {
          pos: {
            obj: actor2,
            posY: 1,
            posX: 0,
          },
          right: true,
        },
      },
    },
    {
      // - - - - - - - - - - - - - - - - - - - - - - - -  3 // standing up / in love
      camera: {
        zoom: getZoom(),
        panY: panY[3],
        panX: panX[3],
        panYrel: -0.5,
      },
      list: {
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          eyes: {
            eyeBrowMove: { map: 'a', min: -0.7, max: 0.6 },
            a: true,
          },
          mouth: {
            sY: 0.5,
            posY: { map: 'a', min: 1, max: 0 },
            curveSY: { map: 'a', min: -0.7, max: 0.7 },
            sX: { map: 'a', min: 0.3, max: 1 },
            teethTopSY: { map: 'a', min: 0.3, max: 1 },
            teethBottomSY: { map: 'a', min: 0.3, max: 1 },
          },
          body: {
            lean: { map: 'a', min: -0.2, max: 0.3 },
          },
          armLeft: {
            pos: {
              map: 'a',
              max: {
                obj: actor2.head,
                posX: 0.5,
                posY: 0.5,
              },
              min: actor1LeftHandOnLap.pos,
            },
            maxStraight: 0.85,
            hand: {
              map: 'a',
              min: {
                angle: 0.5,
              },
              max: {
                target: {
                  obj: actor2.head,
                  posX: 0.5,
                  posY: 0.5,
                },
              },
            },
          },
          armRight: actor1RightHandOnTable,
          sitting: true,
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          eyes: {
            eyeBrowMove: { map: 'a', min: -0.3, max: 0.3 },
            a: true,
          },
          mouth: {
            sY: { map: 'a', min: 0, max: 0.4 },
            curveSY: { map: 'a', min: -0.6, max: 1 },
          },
          body: {
            lean: { map: 'a', min: -0.2, max: 0.3 },
            side: { map: 'a', max: -0.5, min: 0 },
          },
          armLeft: actor2LeftHandOnTable,
          armRight: actor2RightHandOnTable,
          pos: actor2standing,
        },
        glass: glassFallenOver,
        chair2: chair2FallenOver,
        emotion1: {
          pos: {
            obj: actor1,
            posY: 1,
            posX: 0,
          },
          heart: true,
        },
        emotion2: {
          pos: {
            obj: actor2,
            posY: 1,
            posX: 0,
          },
          heart: true,
          thunder: true,
          right: true,
        },
      },
    },
    {
      // - - - - - - - - - - - - - - - - - - - - - - - -  4 // ex-on the table
      camera: {
        zoom: getZoom(),
        panY: panY[4],
        panX: panX[4],
        panYrel: -0.5,
      },
      list: {
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          eyes: {
            eyeBrowMove: { map: 'a', min: -1, max: 0.8 },
            pupilS: { map: 'a', min: 0.7, max: 1 },
          },
          mouth: {
            sY: { map: 'a', min: 1, max: 0 },
            curveSY: { map: 'a', min: -0.7, max: 0.7 },
            sX: { map: 'a', min: 1, max: 0.3 },
          },
          body: {
            lean: { map: 'a', min: -0.3, max: 0.5 },
          },
          armLeft: {
            pos: {
              map: 'a',
              min: {
                obj: actor2.head,
                posX: 0.5,
                posY: -0.2,
              },
              max: {
                obj: stage,
                posX: 0,
                posY: 0.5,
              },
            },
            hand: {
              map: 'a',
              min: {
                target: {
                  obj: actor2.head,
                  posX: 0.5,
                  posY: 0.5,
                },
              },
              max: { angle: 1 },
            },
            maxStraight: 0.99,
            z: 2000,
          },
          armRight: {
            pos: {
              map: 'a',
              min: {
                obj: actor2.head,
                posX: 0.5,
                posY: 0.5,
              },
              max: {
                obj: stage,
                posX: 0.7,
                posY: 1,
              },
            },
            hand: {
              map: 'a',
              min: {
                target: {
                  obj: actor2.head,
                  posX: 0.5,
                  posY: 0.5,
                },
              },
              max: { angle: 0.55 },
            },
            flip: true,
            maxStraight: 0.95,
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
            eyeBrowMove: { map: 'a', min: -1, max: 0.8 },
            pupilS: { map: 'a', min: 0.8, max: 1 },
            a: true,
          },
          body: {
            lean: { map: 'a', min: -0.3, max: 0.5 },
          },
          mouth: {
            sY: { map: 'a', min: 1, max: 0 },
            curveSY: { map: 'a', min: -0.7, max: 0.7 },
            sX: { map: 'a', min: 0.3, max: 1 },
          },
          armLeft: {
            pos: {
              map: 'a',
              min: { obj: actor1.head, posX: 0.5, posY: 0.5 },
              max: { obj: stage, posX: 0.5, posY: 1 },
            },
            hand: {
              map: 'a',
              min: {
                target: {
                  obj: actor1.head,
                  posX: 1,
                  posY: 0.5,
                },
              },
              max: { angle: 1 },
            },
            maxStraight: 0.99,
            flip: true,
            z: -2000,
          },
          armRight: {
            pos: {
              map: 'a',
              min: { obj: actor1.head, posX: 0.5, posY: 0.1 },
              max: { obj: stage, posX: 1, posY: 1 },
            },
            hand: {
              map: 'a',
              min: {
                target: {
                  obj: actor1.head,
                  posX: 0,
                  posY: 0.5,
                },
              },
              max: { angle: 0.55 },
            },
            maxStraight: 0.95,
          },
          pos: actor2standing,
        },
        chair1: chair1FallenOver,
        chair2: chair2FallenOver,
        glass: glassFallenOver,
      },
    },
    {
      // - - - - - - - - - - - - - - - - - - - - - - - -  5 // ON THE GROUND
      camera: {
        zoom: { map: 'a', min: 0.3, max: 0.6 },
        focus: { obj: actor1, posX: 0.5, posY: 1 },
      },
      list: {
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          eyes: {
            eyeBrowMove: { map: 'a', min: 0.5, max: 0.8 },
            pupilPosXrel: { map: 'a', min: 0.5, max: 0 },
            pupilPosYrel: { map: 'a', min: 0.5, max: 0 },
            pupilS: { map: 'a', min: 0.1, max: 1 },
            openSY: { map: 'a', min: 2, max: 1 },
            a: true,
          },
          mouth: {
            sY: { map: 'a', min: 1, max: 0 },
            posY: { map: 'a', min: 1, max: 0 },
            curveSY: { map: 'a', min: -1, max: 0.7 },
            sX: { map: 'a', min: 1, max: 0.1 },
            teethBottomSY: { map: 'a', min: 1, max: 0 },
          },
          pos: actor1OnTheGround,
          rotate: -90,
          body: {
            side: { map: 'a', min: 0.2, max: 1 },
          },
          armLeft: {
            pos: {
              map: 'a',
              min: { obj: actor2, posX: 0.5, posY: 0.5 },
              max: { obj: stage, posX: -0.6, posY: 0.3 },
            },
            hand: {
              map: 'a',
              min: {
                angle: -0.8,
              },
              max: {
                angle: -0.3,
              },
            },
            z: 100000,
          },
          armRight: {
            pos: {
              map: 'a',
              min: { obj: actor2, posX: 0.5, posY: 0.5 },
              max: { obj: stage, posX: -0.5, posY: 0.5 },
            },
            hand: {
              map: 'a',
              min: {
                angle: -0.5,
              },
              max: {
                angle: -0.3,
              },
            },
            flip: true,
            z: -500,
          },
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          eyes: {
            eyeBrowMove: { map: 'a', min: -1, max: 0.8 },
            pupilS: 1,
            a: true,
          },
          mouth: {
            sY: { map: 'a', min: 1, max: 0 },
            curveSY: { map: 'a', min: -0.7, max: 0.7 },
            sX: { map: 'a', min: 1, max: 0.3 },

            teethTopSY: { map: 'a', min: 1, max: 0 },
            teethBottomSY: { map: 'a', min: 1, max: 0.2 },
          },
          body: {
            side: -1,
            lean: { map: 'a', max: -0.1, min: -0.5 },
          },
          pos: { obj: actor1, posX: 0, posY: 1 },
          armLeft: {
            pos: { obj: actor1.head, posX: 1, posY: 0.2 },
            flip: true,
            z: -2000,
            hand: {
              target: { obj: actor1.head, posX: 1, posY: 1 },
            },
          },
          armRight: {
            pos: {
              map: 'a',
              min: { obj: actor1.head, posX: 0.8, posY: 0.5 },
              max: { obj: actor1.head, posX: 1.1, posY: 0.5 },
            },
            hand: {
              map: 'a',
              min: {
                target: {
                  obj: actor1.head,
                  posX: 0,
                  posY: 0,
                },
              },
              max: { angle: 0 },
            },
          },
          bendLeg: true,
          rotate: -90,
        },
        chair1: chair1FallenOver,
        chair2: chair2FallenOver,
        // table: tableOnGround,
        glass: glassOnGround,
      },
    },
    {
      // - - - - - - - - - - - -  6 // BIG FACE
      // zoomTo: actor1,
      camera: {
        zoom: { map: 'b', min: 0.5, max: 0.8 },
        focus: { obj: actor1, posX: 0.5, posY: 0.8 },
      },
      list: {
        stage: {},
        actor1: actor1Dead,
        actor2: actor2Reacts,
        chair1: chair1FallenOver,
        chair2: chair2FallenOver,
        // table: tableOnGround,
        glass: glassOnGround,
      },
    },
    {
      // - - - - - - - - - - - -  7 // DIEING
      // noDefaults: true,
      camera: {
        zoom: { map: 'b', min: 0.8, max: 0.5 },
        focus: { obj: actor2, posX: 0.5, posY: 0.5 },
      },
      list: {
        stage: {},
        actor1: actor1Dead,
        actor2: actor2Reacts,
        chair1: chair1FallenOver,
        chair2: chair2FallenOver,
        // table: tableOnGround,
        glass: glassOnGround,
      },
    },
    {
      // - - - - - - - - - - - -  8
      camera: {
        zoom: 0.6,
        panY: 0.2,
      },
      list: {
        actor1: actor1Dead,

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
          armRight: {
            pos: { obj: actor2, posX: 1.5, posY: 0.6 },
            hand: { angle: 0.8 },
            maxStraight: 0.9,
            flip: true,
          },
          armLeft: {
            pos: { obj: actor2, posX: -0.3, posY: 0.4 },
            hand: { angle: -0.3 },
            maxStraight: 0.9,
          },
        },

        // table: tableOnGround,
        chair1: chair1FallenOver,
        chair2: chair2FallenOver,
        glass: glassOnGround,
      },
    },
  ]

  return {
    paperColor: [220, 220, 220],
    roundTopCorners: this.rIf(0.5),
    roundBottomCorners: this.rIf(0.5),
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
            posY: -0.1,
          },
        },
        actor1: {
          // - - - - - - - - - - - ACTOR 1
          z: 2000,
          body: {
            side: 0.5,
          },
          pos: { obj: chair1, posX: 0, posY: 1 },
        },
        actor2: {
          // - - - - - - - - - - - ACTOR 2
          z: 3000,
          body: {
            side: -0.5,
          },
          pos: { obj: chair2, posX: 1, posY: 1 },
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
