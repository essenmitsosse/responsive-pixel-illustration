// BEGINN getTableComic /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const getTableComic = function getTableComic(args) {
  this.panel = new this.basic.Panel()

  this.story = new this.basic.getStory(args)

  this.comic = {
    paperColor: [40, 40, 40],
    roundTopCorners: this.rIf(0.5),
    roundBottomCorners: this.rIf(0.5),
    ratio: 1.3,
    basicPanel: this.panel,
    panels: this.story.getPanels(args.panels !== undefined ? args.panels : 3),
  }

  return this.comic
}
// END getTableComic \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN getStory /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const getStory = function getStory() {
  this.stage = new this.basic.Stage()

  this.colors = new this.basic.getColorScheme()

  this.actorsList = new this.basic.getActors(this)
}

getStory.prototype.getStoryFrameWork = function (totalPanelCount) {
  var actor0StandUp = 0.1,
    stage = this.stage,
    actorsList = this.actorsList,
    actor0 = actorsList.actor0.renderObject,
    actor1 = actorsList.actor1.renderObject,
    table = actorsList.table.renderObject,
    glass = actorsList.glass.renderObject,
    chair0 = actorsList.chair0.renderObject,
    chair1 = actorsList.chair1.renderObject,
    // emotion0 = actorsList.emotion0.renderObject,
    // emotion1 = actorsList.emotion1.renderObject,

    actor0sitting = {
      posX: 0.2,
      posY: 1,
      obj: chair0,
    },
    chair0Pos = {
      obj: stage,
      posX: 0.1,
      posY: 0,
    },
    mainSteps = [
      {
        // - - -  START step 0 - - - - - - - - - - - - - SITTING
        list: {
          table: {
            pos: {
              obj: stage,
              posX: 0.5,
              posY: -0.05,
            },
          },
          chair0: {
            start: {
              pos: chair0Pos,
              z: -5000,
              rotate: 0,
            },
          },
          chair1: {
            start: {
              pos: {
                obj: stage,
                posX: 0.85,
              },
              z: -5000,
            },
          },
          actor0: {
            // actor 0 — frame 0
            start: {
              pos: actor0sitting,
              body: {
                lean: { map: 'a', min: -0.1, max: -0.1 },
                side: 0.2,
              },
              eyeLeft: {
                pupilPosXrel: 0.8,
                eyeBrowMove: {},
              },
              eyeRight: {
                pupilPosXrel: 0.2,
                eyeBrowMove: {},
              },
              mouth: {
                sY: 0.3,
                sX: 0.4,
                curveSY: { map: 'a', min: 0, max: 0 },
              },
              armLeft: {
                pos: {
                  obj: actor0.body.legs,
                  posX: 0.8,
                  posY: 1,
                },
                hand: { angle: -0.5 },
              },
              armRight: {
                pos: {
                  obj: actor0.body.legs,
                  posX: 0.5,
                  posY: 0.8,
                },
                hand: { angle: 0.5 },
              },
              sitting: true,
              z: -2000,
            },
            end: {
              body: {
                lean: { map: 'a', min: -0.3, max: 0.3 },
                side: 0.5,
              },
              eyeLeft: {
                pupilPosXrel: 0,
                eyeBrowMove: {
                  relPos: 0.8,
                  value: { map: 'a', min: -0.3, max: 0.3 },
                },
              },
              eyeRight: {
                pupilPosXrel: 1,
                eyeBrowMove: {
                  relPos: 0.8,
                  value: { map: 'a', min: -0.3, max: 0.3 },
                },
              },
              mouth: {
                sY: 0.5,
                sX: 0.8,
                curveSY: { map: 'a', min: -0.2, max: 0.2 },
              },
              armRight: {
                relPos: 0.5,
                value: {
                  pos: { obj: table, posY: 1, ellbow: true },
                  hand: { angle: 0.5 },
                },
              },
            },
          },
          actor1: {
            // actor 1 — frame 0
            start: {
              pos: {
                posX: 0.5,
                posY: 1,
                obj: chair1,
              },
              body: {
                lean: 0.1,
                side: 0.1,
              },
              eyeLeft: {
                eyeBrowMove: { map: 'a', min: 0, max: 0 },
                pupilPosXrel: 0.2,
              },
              eyeRight: {
                eyeBrowMove: { map: 'a', min: 0, max: 0 },
                pupilPosXrel: 0.8,
              },
              mouth: {
                sY: 0,
                sX: 0.5,
                curveSY: { map: 'a', min: 0, max: 0 },
              },
              armLeft: {
                pos: { obj: table, posY: 1, posX: 0.5 },
                hand: { angle: -0.5 },
                flip: true,
                z: -100,
              },
              armRight: {
                pos: { obj: table, posY: 1, posX: 0.8 },
                hand: { angle: -0.5 },
              },
              sitting: true,
              z: -1000,
            },
            end: {
              body: {
                side: -0.4,
              },
              eyeLeft: {
                eyeBrowMove: { map: 'a', min: -0.5, max: 0.5 },
                pupilPosXrel: 1,
              },
              eyeRight: {
                eyeBrowMove: { map: 'a', min: -0.5, max: 0.5 },
                pupilPosXrel: 0,
              },
              mouth: {
                sY: { map: 'a', min: 0.5, max: 0.25 },
                sX: 0.9,
                curveSY: { map: 'a', min: -0.3, max: 0.3 },
              },
              armRight: {
                relPos: 0.7,
                value: {
                  pos: { obj: glass, posX: 1, posY: 0.6 },
                  hand: { angle: -0.5 },
                  z: 100000,
                },
              },
            },
          },
          glass: {
            start: {
              pos: {
                obj: table,
                posX: 0.8,
                posY: 1,
              },
              rotate: 0,
              level: { map: 'a', min: 0.15, max: 0.75 },
            },
          },

          emotion0: {
            start: {
              pos: {},
              size: -1,
            },
            end: {
              pos: {
                relPos: 0.5,
                value: {
                  obj: actor0,
                  posY: 1,
                  posX: 0,
                },
              },
              size: 1,
            },
          },

          emotion1: {
            start: {
              pos: {},
              size: -0.1,
              right: true,
            },
            end: {
              pos: {
                relPos: 0.5,
                value: {
                  obj: actor1,
                  posY: 1,
                  posX: 0,
                },
              },
              size: 0.9,
            },
          },
        },
        cameras: [
          {
            minPanels: 3,
            pos: 0.5,
            camera: {
              zoom: 0.5,
              focus: {
                map: 'altCamera',
                min: { obj: actor0, posX: 0.5, posY: 0.5 },
                max: { obj: actor1, posX: 0.5, posY: 0.5 },
              },
            },
          },
          {
            minPanels: 1,
            pos: 0,
            camera: {
              zoom: 1,
              focus: {
                map: 'altCamera',
                min: { obj: glass, posX: 0.5, posY: 0.6 },
                max: { obj: actor1, posX: 0.5, posY: 0.5 },
              },
            },
          },
        ],
        lengthAbs: 3,
        priority: 13,
      },
      // - - -  END step 0 - - - - - - - - - - - - -
      {
        // - - -  START step 1 - - - - - - - - - - - - - STANDING UP
        list: {
          table: {},
          chair0: {
            start: { pos: chair0Pos, rotate: 0 },
            end: {
              pos: {
                posX: { relPos: actor0StandUp, value: -0.1 },
                posY: { relPos: actor0StandUp, value: 0.1 },
              },
              rotate: { relPos: actor0StandUp, value: -90 },
            },
          },
          chair1: {
            start: {
              pos: { obj: stage, posX: 1.2 },
            },
          },
          glass: {
            start: { rotate: -90, level: 0 },
          },
          actor0: {
            // actor 0 — frame 1
            start: {
              pos: actor0sitting,
              body: {
                side: 0.5,
                lean: { map: 'a', min: -0.3, max: 0.5 },
              },
              eyes: {
                pupilPosXrel: 0,
                eyeBrowMove: { map: 'a', min: -0.7, max: 0.6 },
                pupilS: { map: 'a', min: 1, max: 1 },
              },
              mouth: {
                sX: { map: 'a', min: 0.3, max: 1 },
                sY: { map: 'a', min: 0.5, max: 0.5 },
                posY: { map: 'a', min: 1, max: 0 },
                curveSY: { map: 'a', min: -0.7, max: 0.7 },
                teethTopSY: { map: 'a', min: 0.3, max: 1 },
                teethBottomSY: { map: 'a', min: 0.3, max: 1 },
              },
              armLeft: {
                pos: {
                  obj: actor0.body.legs,
                  posX: 0.8,
                  posY: 1,
                },
                hand: { angle: -0.5 },
              },
              armRight: {
                pos: { obj: table, posY: 1, ellbow: true },
                hand: { angle: 0.5 },
              },
              sitting: true,
            },
            end: {
              pos: {
                relPos: actor0StandUp,
                value: {
                  posX: 0.3,
                  posY: 0,
                  obj: stage,
                },
              },
              eyes: {
                eyeBrowMove: { map: 'a', min: -1, max: 0.8 },
                pupilS: { map: 'a', min: 0.7, max: 1 },
              },
              mouth: {
                sX: { map: 'a', min: 1, max: 0.3 },
                sY: { map: 'a', min: 1, max: 0 },
              },
              body: { side: 0.7 },
              armLeft: {
                relPos: actor0StandUp,
                value: {
                  pos: {
                    map: 'a',
                    min: {
                      obj: actor1.head,
                      posX: 0.5,
                      posY: -0.2,
                    },
                    max: {
                      obj: actor0.head,
                      posX: -1,
                      posY: 0.5,
                    },
                  },
                  hand: {
                    map: 'a',
                    min: {
                      target: {
                        obj: actor1.head,
                        posX: 0.5,
                        posY: 0.5,
                      },
                    },
                    max: { angle: 1 },
                  },
                  flip: true,
                },
              },

              armRight: {
                relPos: actor0StandUp,
                value: {
                  pos: {
                    map: 'a',
                    min: {
                      obj: actor1.head,
                      posX: 0.5,
                      posY: 0.5,
                    },
                    max: {
                      obj: actor0.head,
                      posX: 1.5,
                      posY: 0.8,
                    },
                  },
                  hand: {
                    map: 'a',
                    min: {
                      target: {
                        obj: actor1.head,
                        posX: 0.5,
                        posY: 0.5,
                      },
                    },
                    max: { angle: 0.55 },
                  },
                  flip: true,
                },
              },
              sitting: { value: false, relPos: actor0StandUp },
            },
          },
          actor1: {
            // actor 1 — frame 1
            start: {
              pos: { posX: 0.8, posY: 0, obj: stage },
              body: {
                side: -0.7,
                lean: { map: 'a', min: -0.4, max: 0.3 },
              },
              armRight: {
                pos: { obj: table, posY: 1, posX: 0.9 },
                hand: { angle: -0.5 },
                maxStraight: 0.95,
              },
              armLeft: {
                pos: {
                  map: 'a',
                  min: { obj: actor0, posY: 0.5, posX: -0.2 },
                  max: { obj: actor0, posY: 0.5, posX: -0.2 },
                },
                hand: {
                  map: 'a',
                  min: {
                    target: {
                      obj: actor0,
                      posX: 1,
                      posY: 0.5,
                    },
                  },
                  max: { angle: 1 },
                },
                flip: true,
                z: -1000,
                maxStraight: 0.95,
              },
              sitting: false,
            },
            end: {
              armRight: {
                relPos: 0.5,
                value: {
                  pos: {
                    map: 'a',
                    min: {
                      obj: actor0.head,
                      posY: 0.5,
                      posX: 0.5,
                    },
                    max: {
                      obj: actor1,
                      posY: 1,
                      posX: 0.9,
                    },
                  },
                  hand: {
                    map: 'a',
                    min: {
                      target: {
                        obj: actorsList.actor0.renderObject,
                        posX: 0,
                        posY: 0.8,
                      },
                    },
                    max: { angle: 0.55 },
                  },
                },
              },
              armLeft: {
                pos: {
                  map: 'a',
                  min: { obj: actor1, posY: 0.6, posX: -1.5 },
                  max: { obj: actor1, posY: 1, posX: -1.2 },
                },
              },
            },
          },

          emotion0: {
            start: {
              pos: {},
              size: 0.5,
              heart: true,
            },
            end: {
              pos: {
                relPos: 0.5,
                value: { obj: actor0, posY: 1.1 },
              },
              size: 1,
            },
          },

          emotion1: {
            start: {
              pos: {},
              size: 0.6,
              right: true,
              heart: true,
              thunder: true,
            },
            end: {
              pos: {
                relPos: 0.5,
                value: { obj: actor1, posY: 1 },
              },
              size: 0.9,
            },
          },
        },
        cameras: [
          {
            minPanels: 3,
            pos: 0.3,
            camera: {
              zoom: 1,
              focus: {
                map: 'altCamera',
                min: { obj: glass, posX: 0.5, posY: 0.6 },
                max: { obj: actor1, posX: 0.5, posY: 0.5 },
              },
            },
          },
        ],
        lengthAbs: 2,
        priority: 9,
      },
      // - - -  START step 1 - - - - - - - - - - - - -
      {
        // - - -  START step 2 - - - - - - - - - - - - - ON THE TABLE
        list: {
          table: {},
          chair0: {},
          chair1: {},
          glass: {
            pos: { obj: stage, posY: 0, posX: 0.8 },
            rotate: 90,
          },
          actor0: {
            // actor 0 — frame 2
            start: {
              body: { lean: -0.1, side: 1 },
              pos: { obj: table, posX: 1, posY: 1 },
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
              armLeft: {
                pos: {
                  map: 'a',
                  min: { obj: actor1, posX: 0.5, posY: 0.5 },
                  max: { obj: stage, posX: -0.6, posY: 0.3 },
                },
                hand: {
                  map: 'a',
                  min: { angle: -0.8 },
                  max: { angle: -0.3 },
                },
                z: 100000,
              },
              armRight: {
                pos: {
                  map: 'a',
                  min: { obj: actor1, posX: 0.5, posY: 0.5 },
                  max: { obj: stage, posX: -0.5, posY: 0.5 },
                },
                hand: {
                  map: 'a',
                  min: { angle: -0.5 },
                  max: { angle: -0.3 },
                },
                flip: true,
                z: -500,
              },
              sitting: false,
              rotate: -90,
            },
          },
          actor1: {
            // actor 1 — frame 2
            start: {
              pos: { obj: actor0, posX: 0, posY: 1 },
              body: {
                side: -1,
                lean: { map: 'a', min: -1, max: -0.3 },
              },
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
              armLeft: {
                pos: { obj: actor0.head, posX: 1, posY: 0.8 },
                // flip: true,
                x: 0.15,
                z: -20000,
                hand: {
                  target: {
                    obj: actor0.head,
                    posX: 1,
                    posY: 1,
                  },
                },
              },
              armRight: {
                pos: {
                  map: 'a',
                  min: {
                    obj: actor0.head,
                    posX: 0.8,
                    posY: 0.5,
                  },
                  max: {
                    obj: actor0.head,
                    posX: 1.1,
                    posY: 1,
                  },
                },
                x: 0.7,
                hand: {
                  map: 'a',
                  min: {
                    target: {
                      obj: actor0.head,
                      posX: 0,
                      posY: 0,
                    },
                  },
                  max: { angle: 0 },
                },
              },
              rotate: -90,
              z: 3000,
            },
            end: {
              body: { lean: { map: 'a', min: -0.5, max: 0 } },
            },
          },
        },

        cameras: [
          {
            minPanels: 1,
            pos: 0,
            camera: {
              zoom: { map: 'altCamera', min: 0.3, max: 0.6 },
              focus: { obj: actor1, posX: 0.5, posY: -0.2 },
            },
          },
          {
            minPanels: 2,
            pos: 0.5,
            camera: {
              zoom: { map: 'altCamera', min: 0.3, max: 0.6 },
              focus: { obj: glass, posX: 0.5, posY: 0.5 },
            },
          },
        ],
        lengthAbs: 1,
        priority: 7,
      },
      // - - -  END step 2 - - - - - - - - - - - - -
      {
        // - - -  START step 3 - - - - - - - - - - - - - REACTION
        list: {
          table: { z: 10000 },
          chair0: {},
          chair1: {},
          glass: {},
          actor0: {
            // actor 0 — frame 2
            start: {
              body: {
                lean: -0.1,
                side: { map: 'b', min: 0.2, max: 1 },
              },
              eyes: false,
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
                pos: { obj: table, posY: 1, ellbow: true },
                hand: { angle: -0.8 },
                maxStraight: 0.9,
                flip: true,
                z: -5000000,
              },
              armLeft: {
                pos: { obj: table, posY: 1, ellbow: true },
                hand: { angle: -0.6 },
                maxStraight: 0.9,
                flip: true,
                z: 1000000,
              },
              z: 10000,
              sitting: false,
              rotate: -90,
            },
          },
          actor1: {
            // actor 1 — frame 2
            start: {
              rotate: 0,
              pos: { obj: stage, posX: 1, posY: 0 },
              body: { lean: { relPos: 0.3, value: 0 } },
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
                  min: { obj: actor1, posX: 1.5, posY: 0.5 },
                  max: {
                    obj: actor1.head,
                    posX: 1.2,
                    posY: 1.2,
                  },
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
                  min: { obj: actor1, posX: -0.2, posY: 0 },
                  max: {
                    obj: actor1.head,
                    posX: -0.3,
                    posY: 0.3,
                  },
                },
                hand: {
                  map: 'b',
                  min: { angle: -0.9 },
                  max: { angle: 0.6 },
                },
                maxStraight: 1,
                flip: true,
              },
            },
            end: {
              armRight: {
                pos: {
                  map: 'b',
                  min: { obj: actor1, posX: 1.5, posY: 0 },
                  max: {
                    obj: actor1.head,
                    posX: 1.2,
                    posY: 1.2,
                  },
                },
                hand: {
                  map: 'b',
                  min: { angle: 0.8 },
                  max: { angle: -0.9 },
                },
                maxStraight: 1,
                flip: true,
              },
              armLeft: {
                pos: {
                  map: 'b',
                  min: { obj: actor1, posX: -0.5, posY: 0.5 },
                  max: {
                    obj: actor1.head,
                    posX: 0.1,
                    posY: 1,
                  },
                },
                hand: {
                  map: 'b',
                  min: { angle: -0.9 },
                  max: { angle: 0.6 },
                },
                maxStraight: 0.95,
                flip: true,
              },
            },
          },
        },
        cameras: [
          {
            minPanels: 1,
            pos: 0,
            camera: {
              zoom: { map: 'altCamera', min: 1, max: 0.8 },
              focus: {
                map: 'altCamera',
                min: { obj: actor1, posX: 0.5, posY: 0.5 },
                max: { obj: actor0, posX: 0.5, posY: 0.5 },
              },
            },
          },
          {
            minPanels: 2,
            pos: 0.5,
            camera: {
              zoom: { map: 'altCamera', min: 0.8, max: 1 },
              focus: {
                map: 'altCamera',
                min: { obj: actor0, posX: 0.5, posY: 0.5 },
                max: { obj: actor1, posX: 0.5, posY: 0.5 },
              },
            },
          },
        ],
        lengthAbs: 2,
        priority: 6,
      },
      // - - -  END step 3 - - - - - - - - - - - - -
      {
        // - - -  START step 4 - - - - - - - - - - - - - LEAVING
        list: {
          table: {},
          chair0: {},
          chair1: {},
          glass: {},
          actor0: {
            // actor 0 — frame 4
          },
          actor1: {
            // actor 1 — frame 4
            start: {
              eyeLeft: {
                openSY: 1,
                sY: 1.2,
                pupilPosY: 0.5,
              },
              eyeRight: {
                openSY: 1,
                sY: 1.2,
                pupilPosY: 0.5,
              },
              mouth: {
                sX: 0,
              },
              pos: { obj: stage, posX: 0.8, posY: -0.1 },
              body: { side: 0.2 },
              armRight: {
                pos: { obj: actor1, posX: -0.3, posY: 0.6 },

                hand: { angle: 0.8 },
                maxStraight: 0.9,
                flip: true,
              },
              armLeft: {
                pos: { obj: actor1, posX: 1.5, posY: 0.4 },
                hand: { angle: -0.3 },
                maxStraight: 0.9,
              },
            },
            end: {
              pos: {
                obj: stage,
                posX: 1.5,
                posY: -0.2,
              },
              body: { side: 1 },

              armRight: {
                pos: { obj: actor1, posX: 1.5, posY: 0.6 },
              },
              armLeft: {
                pos: { obj: actor1, posX: -0.3, posY: 0.4 },
              },
            },
          },
        },
        cameras: [
          {
            minPanels: 2,
            pos: 0.3,
            camera: {
              zoom: 0.8,
              focus: {
                map: 'altCamera',
                min: { obj: actor1, posX: 0.5, posY: 0.5 },
                max: { obj: glass, posX: 0.5, posY: 0.5 },
              },
            },
          },
          {
            minPanels: 3,
            pos: 0.8,
            camera: {
              zoom: 0.8,
              focus: {
                map: 'altCamera',
                min: { obj: glass, posX: 0.5, posY: 0.5 },
                max: { obj: actor1, posX: 0.5, posY: 0.5 },
              },
            },
          },
        ],
        lengthAbs: 1,
        priority: 12,
      },
      // - - -  END step 4 - - - - - - - - - - - - -
    ],
    count,
    panelCount = 0,
    totalArcLength = 0,
    current,
    removePanels,
    relArcEnd = 0,
    panelsLeft = totalPanelCount,
    arcLength = mainSteps.length,
    panels = []

  // get the total Length of all Story Arcs
  count = 0

  while (count < arcLength) {
    mainSteps[count].endLengthAbs = totalArcLength += mainSteps[count].lengthAbs

    count += 1
  }

  // get the relative Length for each Arc
  count = 0

  count = 0

  while (count < arcLength) {
    mainSteps[count].relLength = mainSteps[count].lengthAbs / totalArcLength

    mainSteps[count].relStart = relArcEnd

    mainSteps[count].relEnd = relArcEnd += mainSteps[count].relLength

    mainSteps[count].absFloatLength =
      totalPanelCount * mainSteps[count].relLength

    mainSteps[count].absLength = Math.round(mainSteps[count].absFloatLength)

    if (mainSteps[count].absLength <= 0) {
      mainSteps[count].absLength = 1
    }

    panelsLeft -= mainSteps[count].absLength

    count += 1
  }

  removePanels = panelsLeft > 0 ? 1 : -1

  while (panelsLeft) {
    var arcStart = 0,
      arcEnd = mainSteps.length - 1,
      forward = true,
      lowestPriority = panelsLeft > 0 ? -Infinity : Infinity,
      biggestArc,
      currentNr

    arcLength = mainSteps.length

    while (arcLength) {
      if (forward) {
        currentNr = arcStart++
      } else {
        currentNr = arcEnd--
      }

      forward = !forward

      current = mainSteps[currentNr]

      if (
        current.absLength > 0 &&
        (panelsLeft > 0
          ? current.priority >= lowestPriority
          : current.priority <= lowestPriority)
      ) {
        lowestPriority = current.priority

        biggestArc = currentNr

        current.priority += panelsLeft
      }

      arcLength -= 1
    }

    mainSteps[biggestArc].absLength += removePanels

    mainSteps[biggestArc].absFloatLength += removePanels

    panelsLeft -= removePanels
  }

  // Main
  // relPosition

  count = 0

  while (count < mainSteps.length) {
    current = mainSteps[count]

    var totalCount = current.absLength,
      innerCount = 0,
      cameras = current.cameras,
      camerasLength = cameras && cameras.length,
      cameraCount = 0,
      currentStart = panelCount,
      currentCam

    if (totalCount === 0) {
      panels.push({
        main: current,
        arc: count,
        relPosition: 1,
        dontRender: true,
      })
    } else {
      while (innerCount < totalCount) {
        // console.log( count, totalCount, innerCount, innerCount, ( totalCount - 1 ) );

        panels.push({
          main: current,
          arc: count,
          relPosition: totalCount === 1 ? 1 : innerCount / (totalCount - 1),
        })

        innerCount += 1

        panelCount += 1
      }
    }

    while (cameraCount < camerasLength) {
      currentCam = cameras[cameraCount]

      if (innerCount >= currentCam.minPanels) {
        panels[Math.round(currentStart + currentCam.pos * totalCount)].camera =
          currentCam.camera
      }

      cameraCount += 1
    }

    count += 1
  }

  panels[0].relPosition = 0

  // Check if last displays the very end
  if (current.relPosition < 1) {
    current.relPosition = 1
  }

  return panels
}

getStory.prototype.getPanels = function getStoryPanels(totalPanelCount) {
  var panels = [],
    currentPanelNumber = 0,
    currentFrame

  this.storyFramework = this.getStoryFrameWork(totalPanelCount)

  totalPanelCount = this.storyFramework.length

  if (totalPanelCount < 1) {
    totalPanelCount = 1
  }

  while (currentPanelNumber < totalPanelCount) {
    currentFrame = this.storyFramework[currentPanelNumber]

    if (currentFrame.dontRender) {
      this.getPanel(currentFrame, 1)
    } else {
      panels.push({
        camera: currentFrame.camera,
        list: this.getPanel(currentFrame),
      })

      this.getPanel(currentFrame, 1)
    }

    currentPanelNumber += 1
  }

  return panels
}

getStory.prototype.getPanel = function (frame, rel) {
  var main = frame.main.list,
    actorsList = this.actorsList,
    list = [{ what: this.stage }],
    key

  for (key in main) {
    list.push(
      actorsList[key].getAction({
        what: actorsList[key].renderObject,
        info: main[key],
        relPosition: rel || frame.relPosition,
      }),
    )
  }

  return list
}

// END getStory \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN getAnimation /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const getAnimation = function getAnimation(args) {
  var steps = args.endPanelNumber - args.startPanelNumber || 1,
    process = (args.currentPanelNumber - args.startPanelNumber) / steps

  if (process < 0) {
    process = 0
  }

  if (process > 1) {
    process = 1
  }

  return typeof args.start === 'number'
    ? args.start + process * (args.end - args.start)
    : {
        map: args.map,
        min: args.start.min + process * (args.end.min - args.start.min),
        max: args.start.max + process * (args.end.max - args.start.max),
      }
}
// END getAnimation \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN getActors /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const getActors = function (story) {
  var colorSchemes = [
      [0, 1, 2, 1, 2, 1],
      [0, 1, 1, 1, 2, 2],
      [0, 2, 1, 2, 1, 0],
    ],
    colorScheme = colorSchemes[this.rInt(0, colorSchemes.length - 1)]

  this.colors = story.colors

  this.stage = story.stage

  this.baseSkinColor = { nr: colorScheme[0] }

  this.baseSkinColorAlt = { nr: colorScheme[3] }

  this.baseColor1 = { nr: colorScheme[1], shade: this.rFl(0.5, 1) }

  this.baseColor2 = { nr: colorScheme[4], shade: this.rFl(0.5, 1) }

  this.baseColor1Alt = { nr: colorScheme[2], shade: this.rFl(0.5, 1) }

  this.baseColor2Alt = { nr: colorScheme[5], shade: this.rFl(0.5, 1) }

  this.furnitureColor = this.colors.getColor({
    nr: colorScheme[5],
    shade: 0.5,
  })

  this.furnitureDetailColor = this.colors.getColor({
    nr: colorScheme[5],
    shade: 0.3,
  })

  this.actor0 = this.getNewActor({ main: true })

  this.actor1 = this.getNewActor({})

  this.chair0 = new this.basic.RenderObjectContainer(
    new this.basic.Chair({
      color: this.furnitureColor,
      colorDetail: this.furnitureDetailColor,
    }),
  )

  this.chair1 = new this.basic.RenderObjectContainer(
    new this.basic.Chair({
      toLeft: true,
      color: this.furnitureColor,
      colorDetail: this.furnitureDetailColor,
    }),
  )

  this.table = new this.basic.RenderObjectContainer(
    new this.basic.Table({
      color: this.furnitureColor,
      colorDetail: this.furnitureDetailColor,
    }),
  )

  this.glass = new this.basic.RenderObjectContainer(new this.basic.Glass())

  this.emotion0 = new this.basic.RenderObjectContainer(new this.basic.Emotion())

  this.emotion1 = new this.basic.RenderObjectContainer(new this.basic.Emotion())
}

getActors.prototype.getNewActor = function (args) {
  return new this.basic.RenderObjectContainer(
    new this.basic.Actor({
      color: this.colors.getColorMap({
        main: args.main,
        min: this.baseSkinColor,
        max: this.baseSkinColorAlt,
      }),
      firstColor: this.colors.getColorMap({
        main: args.main,
        min: this.baseColor1,
        max: this.baseColor1Alt,
      }),
      secondColor: this.colors.getColorMap({
        main: args.main,
        min: this.baseColor2,
        max: this.baseColor2Alt,
      }),
      main: args.main,
    }),
  )
}
// END getActors \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN RenderObjectConteiner /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const RenderObjectContainer = function (renderObject) {
  this.renderObject = renderObject
}

RenderObjectContainer.prototype.getAction = function (args) {
  var obj = {},
    info = args.info,
    start = (info && info.start) || info,
    end = info && info.end,
    actionProcessor = new this.getActionProcessor(args.relPosition)

  // Check if start or end is needed or a position inbetween
  obj = actionProcessor.checkIfObject(obj, start, end)

  // Add the render Object
  obj.what = this.renderObject

  // Get Default Values if existing
  this.lastObject = obj = this.joinObject(obj, this.lastObject)

  return obj
}

RenderObjectContainer.prototype.joinObject = function (main, defaults) {
  var key

  for (key in defaults) {
    if (main[key] === undefined) {
      main[key] = defaults[key]
    }
  }

  return main
}

RenderObjectContainer.prototype.getActionProcessor = function (rel) {
  this.rel = rel
}

RenderObjectContainer.prototype.getActionProcessor.prototype.processObject =
  function (obj, start, end) {
    var key

    for (key in start) {
      obj[key] = this.checkIfObject(obj[key] || {}, start[key], end && end[key])
    }

    return obj
  }

RenderObjectContainer.prototype.getActionProcessor.prototype.processValue =
  function (obj, start, end) {
    if (end !== undefined) {
      if (typeof start === 'number' && typeof end === 'number') {
        return start + (end - start) * this.rel
      } else {
        if (end.relPos) {
          return this.rel > end.relPos ? end.value : start
        } else {
          return this.rel === 1 ? end : start
        }
      }
    } else {
      return start
    }
  }

RenderObjectContainer.prototype.getActionProcessor.prototype.checkIfObject =
  function (obj, start, end) {
    // console.log( "check", ( ( end && end.relPos ) ), end );

    if ((end && end.relPos) || start.basic || typeof start !== 'object') {
      return this.processValue(obj, start, end)
    } else {
      return this.processObject(obj, start, end)
    }
  }
// END RenderObjectConteiner \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN getColorScheme /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
export const getColorScheme = function getColorScheme() {
  var colors = [
      [this.rInt(150, 200), this.rInt(50, 100), this.rInt(100, 150)],
      [this.rInt(50, 100), this.rInt(100, 150), this.rInt(150, 200)],
      [this.rInt(100, 150), this.rInt(150, 200), this.rInt(50, 100)],
    ],
    first = this.rInt(0, 2)

  this.colors = [
    colors[first],
    colors[first === 0 ? 1 : first === 1 ? 2 : 0],
    colors[first === 0 ? 2 : first === 1 ? 0 : 1],
  ]
}

getColorScheme.prototype.getColor = function (args) {
  var shade = args.maxShade ? this.rFl(args.maxShade, 1) : args.shade,
    baseColor =
      this.colors[
        typeof args === 'number'
          ? args
          : args.random
            ? this.rInt(0, this.colors.length - 1)
            : args.nr || 0
      ]

  return shade ? this.multiplyColor(baseColor, shade) : baseColor
}

getColorScheme.prototype.getColorMap = function (args) {
  return args.main
    ? this.getColor(args.min)
    : {
        map: 'actor-color',
        min: this.getColor(args.min),
        max: this.getColor(args.max),
      }
}
// END getColorScheme \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
