// BEGINN Strip /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Strip = function (args) {
  let panelsInfo = args.stripInfo.panels
  let count = panelsInfo.length
  let countSqrt = Math.sqrt(count)
  let i = 0
  let panels = []
  let current
  let sizeCurrent
  let sizeList = []
  let sX
  let sY
  let minSX
  let minSY
  let gutterBase = (this.gutterBase = this.pushLinkList({
    r: 0.2 / countSqrt,
    useSize: args.squareBig,
  }))
  let gutterX = (this.gutterX = this.pushLinkList({
    r: 1,
    useSize: gutterBase,
  }))
  let gutterY = (this.gutterY = this.pushLinkList({
    r: 1,
    useSize: gutterBase,
  }))
  let basicPanel =
    args.stripInfo.basicPanel || new this.basic.Panel(args.stripInfo)
  let imgRatio = { ratio: 1.5 }

  this.pushRelativeStandardAutomatic({
    gutterX: { map: 'gutter-width', min: 0, max: 1 },
    gutterY: { map: 'gutter-height', min: 0, max: 1 },
  })

  this.changersCustomList.push(function (args) {
    if (args.imgRatio) {
      imgRatio.ratio = 1 / args.imgRatio
    }
  })

  do {
    this.linkList.push(
      (sX = {}),
      (sY = {}),
      (minSX = { add: [sX], max: minSX }),
      (minSY = { add: [sY], max: minSY }),
    )

    sizeList.push({
      sX,
      sY,
    })
  } while ((i += 1) < count)

  basicPanel.setStage(minSX, minSY)

  i = 0

  do {
    sizeCurrent = sizeList[i]

    current = basicPanel[panelsInfo[i].method || 'draw']({
      i,
      rel: i / (count - 1),
      sX: sizeCurrent.sX,
      sY: sizeCurrent.sY,
      minSX,
      minSY,
      info: panelsInfo[i],
    })

    // Rounded Border
    if (
      args.stripInfo.roundCorners ||
      args.stripInfo.roundTopCorners ||
      args.stripInfo.roundBottomCorners
    ) {
      current.list.push({
        minX: 6,
        minY: 6,
        list: [
          (args.stripInfo.roundCorners || args.stripInfo.roundTopCorners) && {
            name: 'Dot',
            color: args.paperColor,
          },
          (args.stripInfo.roundCorners || args.stripInfo.roundTopCorners) && {
            name: 'Dot',
            fX: true,
            color: args.paperColor,
          },
          (args.stripInfo.roundCorners ||
            args.stripInfo.roundBottomCorners) && {
            name: 'Dot',
            fY: true,
            color: args.paperColor,
          },
          (args.stripInfo.roundCorners ||
            args.stripInfo.roundBottomCorners) && {
            name: 'Dot',
            fX: true,
            fY: true,
            color: args.paperColor,
          },
        ],
      })
    }

    panels.push(current)
  } while ((i += 1) < count)

  return {
    mask: true,
    gutterX,
    gutterY,
    imgRatio,
    panels,
  }
}
// END Strip \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Panel /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const Panel = function (args) {
  if (!args) {
    args = {}
  }

  this.background =
    args.background !== undefined
      ? args.background
      : new this.basic.Background({})

  // Stage Ratio
  this.ratio = args.ratio || 1.5
}

Panel.prototype.setStage = function (minPanelSX, minPanelSY) {
  this.getSizeWithRatio({
    sX: (this.minPanelSX = minPanelSX),
    sY: (this.minPanelSY = minPanelSY),
    sXName: 'minSX',
    sYName: 'minSY',
  })
}

Panel.prototype.draw = function (args) {
  let info = args.info || {}
  let cameraFocus = info.camera && info.camera.focus

  this.basePanelX = this.pushLinkList({ r: 0.9, useSize: this.minSX })

  this.basePanelY = this.pushLinkList({ r: 0.9, useSize: this.minSY })

  // START camera zoom - - - - - - - - - - - - - - - - -
  if (cameraFocus) {
    // Zoom to actor head size
    if (cameraFocus.map) {
      let zoomToHead1 = cameraFocus
        ? 1 / (cameraFocus.min.obj.headSY_ || cameraFocus.min.obj.sY_)
        : 1
      let zoomToHead2 = cameraFocus
        ? 1 / (cameraFocus.max.obj.headSY_ || cameraFocus.max.obj.sY_)
        : 1

      this.zoomBaseSX = this.getSizeSwitch(
        { r: zoomToHead1, useSize: this.basePanelX },
        { r: zoomToHead2, useSize: this.basePanelX },
        {},
        cameraFocus.map,
      )

      this.zoomBaseSY = this.getSizeSwitch(
        { r: zoomToHead1, useSize: this.basePanelY },
        { r: zoomToHead2, useSize: this.basePanelY },
        {},
        cameraFocus.map,
      )
    } else {
      let zoomToHead = cameraFocus
        ? 1 / (cameraFocus.obj.headSY_ || cameraFocus.obj.sY_)
        : 1

      this.zoomBaseSX = this.pushLinkList({
        r: zoomToHead,
        useSize: this.basePanelX,
      })

      this.zoomBaseSY = this.pushLinkList({
        r: zoomToHead,
        useSize: this.basePanelY,
      })
    }

    // HACK: the min value only works, because actors can’t be bigger
    // Zoom in if actor is smaller
    if (cameraFocus.map) {
      this.zoomBaseActorSizeSX = this.getSizeSwitch(
        (info.camera.zoomBaseActor1SizeSX = {
          r: 1,
          useSize: this.zoomBaseSX,
          min: this.zoomBaseSX,
        }),
        (info.camera.zoomBaseActor2SizeSX = {
          r: 1,
          useSize: this.zoomBaseSX,
          min: this.zoomBaseSX,
        }),
        {},
        cameraFocus.map,
      )

      this.zoomBaseActorSizeSY = this.getSizeSwitch(
        (info.camera.zoomBaseActor1SizeSY = {
          r: 1,
          useSize: this.zoomBaseSY,
          min: this.zoomBaseSY,
        }),
        (info.camera.zoomBaseActor2SizeSY = {
          r: 1,
          useSize: this.zoomBaseSY,
          min: this.zoomBaseSY,
        }),
        {},
        cameraFocus.map,
      )

      if (cameraFocus.min.obj.sizeMap) {
        info.camera.zoomBaseActor1SizeSX = info.camera.zoomBaseActor1SizeSY = {
          map: 'actor-size',
          min: 1 / cameraFocus.min.obj.sizeMap.min,
          max: 1 / cameraFocus.min.obj.sizeMap.max,
        }
      }

      if (cameraFocus.max.obj.sizeMap) {
        info.camera.zoomBaseActor2SizeSX = info.camera.zoomBaseActor2SizeSY = {
          map: 'actor-size',
          min: 1 / cameraFocus.max.obj.sizeMap.min,
          max: 1 / cameraFocus.max.obj.sizeMap.max,
        }
      }
    } else {
      this.zoomBaseActorSizeSX = this.pushLinkList({
        r: 1,
        useSize: this.zoomBaseSX,
        min: this.zoomBaseSX,
      })

      this.zoomBaseActorSizeSY = this.pushLinkList({
        r: 1,
        useSize: this.zoomBaseSY,
        min: this.zoomBaseSY,
      })

      // If it is an actor, who has a sizemap
      if (cameraFocus.obj.sizeMap) {
        // Zoom Based on actor size
        info.camera.zoomBaseActorSizeSX = info.camera.zoomBaseActorSizeSY = {
          map: 'actor-size',
          min: 1 / cameraFocus.obj.sizeMap.min,
          max: 1 / cameraFocus.obj.sizeMap.max,
        }
      }
    }

    // actual zoom, but related to the object zoom
    this.zoomFinalSX = this.pushLinkList({
      r: 1,
      useSize: this.pushLinkList({
        add: [this.basePanelX, this.zoomBaseActorSizeSX],
      }),
    })

    this.zoomFinalSY = this.pushLinkList({
      r: 1,
      useSize: this.pushLinkList({
        add: [this.basePanelY, this.zoomBaseActorSizeSY],
      }),
    })
  } else {
    this.zoomFinalSX = this.pushLinkList({
      r: 1,
      useSize: this.basePanelX,
    })

    this.zoomFinalSY = this.pushLinkList({
      r: 1,
      useSize: this.basePanelY,
    })
  }

  this.zoomDiffSX = this.pushLinkList({
    r: 1,
    useSize: this.pushLinkList({
      add: [{ r: -1, useSize: this.basePanelX }, this.zoomFinalSX],
    }),
  })

  this.zoomDiffSY = this.pushLinkList({
    r: 1,
    useSize: this.pushLinkList({
      add: [{ r: -1, useSize: this.basePanelY }, this.zoomFinalSY],
    }),
  })

  this.stageSX = this.pushLinkList({
    add: [this.basePanelX, this.zoomDiffSX],
  })

  this.stageSY = this.pushLinkList({
    add: [this.basePanelY, this.zoomDiffSY],
  })

  // Attach the zoom value to both SX and SY;
  if (info.camera) {
    info.camera.zoomFinalSX = info.camera.zoomFinalSY = info.camera.zoom
  }

  // Camera Zoom
  this.changersRelativeCustomList.push([
    this.zoomDiffSX,
    this.cameraZoomFunction,
  ])

  this.changersRelativeCustomList.push([
    this.zoomDiffSY,
    this.cameraZoomFunction,
  ])
  // END camera zoom  - - - - - - - - - - - - - - - - -

  // START render stage  - - - - - - - - - - - - - - - - -
  let infoList = (this.infoList = info.list)
  let l = infoList ? infoList.length : 0
  let count = 0
  let current
  let renderList = []
  let drawInfo = {
    stageSX: this.stageSX,
    stageSY: this.stageSY,
    square: this.pushLinkList({
      add: [this.stageSX],
      max: this.stageSY,
    }),
  }
  let finishList = []
  let background = info.background || this.background

  while (count < l) {
    current = infoList[count]

    drawInfo.info = current

    // Check if current returns something and if it is an Array (actor) or already the finished Object
    if (current.pos) {
      current.what.currentPosition = current.pos
    }

    if ((current = current.what.draw(drawInfo))) {
      if (current.constructor === Array) {
        renderList.push(current[0])

        finishList.push(current[1])
      } else {
        renderList.push(current)
      }
    }

    count += 1
  }

  count = finishList.length

  while (count--) {
    finishList[count].finishRendering()
  }
  // END render stage  - - - - - - - - - - - - - - - - -

  // START Camera Pan - - - - - - - - - - - - - - - - - - - - - - - -
  if (cameraFocus) {
    let actorFocus1
    let actorFocus2

    if (cameraFocus.map) {
      actorFocus1 = cameraFocus.min.obj.getFocus(
        this.stageSX,
        this.stageSY,
        cameraFocus.min,
      )

      actorFocus2 = cameraFocus.max.obj.getFocus(
        this.stageSX,
        this.stageSY,
        cameraFocus.max,
      )

      this.actorFocusX = this.pushLinkList({
        r: 0,
        useSize: this.getSizeSwitch(
          actorFocus1.x,
          actorFocus2.x,
          {},
          cameraFocus.map,
        ),
      })

      this.actorFocusY = this.pushLinkList({
        r: 0,
        useSize: this.getSizeSwitch(
          actorFocus1.y,
          actorFocus2.y,
          {},
          cameraFocus.map,
        ),
      })
    } else {
      actorFocus1 = cameraFocus.obj.getFocus(
        this.stageSX,
        this.stageSY,
        cameraFocus,
      )

      this.actorFocusX = this.pushLinkList({
        r: 0,
        useSize: actorFocus1.x,
      })

      this.actorFocusY = this.pushLinkList({
        r: 0,
        useSize: actorFocus1.y,
      })
    }

    // Camera Pan
    this.changersRelativeCustomList.push([
      this.actorFocusX,
      this.cameraPanFunction,
    ])

    this.changersRelativeCustomList.push([
      this.actorFocusY,
      this.cameraPanFunction,
    ])
  }

  // pan relative from the stage to the panel size
  this.stageRestSX = this.pushLinkList({
    add: [args.sX, { r: -1, useSize: this.stageSX }],
  })

  this.stageRestSY = this.pushLinkList({
    add: [args.sY, { r: -1, useSize: this.stageSY }],
  })

  this.panCenterX = this.pushLinkList({ r: 0.5, useSize: this.stageRestSX })

  this.panCenterY = this.pushLinkList({ r: 0.5, useSize: this.stageRestSY })

  this.panXrel = this.pushLinkList({ r: 0, useSize: this.panCenterX })

  this.panYrel = this.pushLinkList({ r: 0, useSize: this.panCenterY })

  // pan relative to the stage
  this.panX = this.pushLinkList({
    r: 0,
    useSize: this.stageSX,
    add: [this.panXrel, (cameraFocus && this.actorFocusX) || 0],
  })

  this.panY = this.pushLinkList({
    r: 0,
    useSize: this.stageSY,
    add: [this.panYrel, (cameraFocus && this.actorFocusY) || 0],
  })

  this.panDiffX = this.pushLinkList({ r: 1, useSize: this.panX })

  this.panDiffY = this.pushLinkList({ r: 1, useSize: this.panY })

  if (info.camera) {
    info.camera.panDiffX = info.camera.panDiffY = {
      map: 'camera',
      min: 0,
      max: 1,
    }
  }

  this.finalPanX = this.pushLinkList({
    add: [this.panDiffX, this.panCenterX],
  })

  this.finalPanY = this.pushLinkList({
    add: [this.panDiffY, this.panCenterY],
  })

  // END Camera Pan - - - - - - - - - - - - - - - - - - - - - - - -

  this.pushRelativeStandardAutomatic(info.camera)

  return {
    sX: args.sX,
    sY: args.sY,
    mask: true,
    list: [
      // Background
      background &&
        background.draw({
          panX: this.finalPanX,
          panY: this.finalPanY,
          stageSX: this.stageSX,
          stageSY: this.stageSY,
          fullSX: args.sX,
          fullSY: args.sY,
          info: info.backgroundInfo,
        }),

      // Inner Panel
      {
        sX: this.stageSX,
        sY: this.stageSY,
        y: this.finalPanY,
        x: this.finalPanX,
        // cX: true,
        // cY: true,
        fY: true,
        list: renderList,
      },
    ],
  }
}

Panel.prototype.cameraZoomFunction = function (args) {
  if (args.camera !== undefined) {
    return Math.pow(args.camera, 3)
  }
}

Panel.prototype.cameraPanFunction = function (args) {
  if (args.camera !== undefined) {
    return Math.pow(args.camera, 0.333)
  }
}
// END Panel \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
