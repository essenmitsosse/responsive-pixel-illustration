/* global TableComic */

// BEGINN Strip /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Strip = function (args) {
  const { stripInfo } = args;
  const panelsInfo = stripInfo.panels;
  const count = panelsInfo.length;
  let i = 0;
  const panels = [];
  let minSX;
  let minSY;
  let current;
  let sizeCurrent;
  const sizeList = [];
  let sX;
  let sY;
  const gutterX = {
    r: 0.025,
    useSize: args.square,
    a: -1,
    min: 1,
  };
  const gutterY = {
    r: 0.04,
    useSize: args.square,
    a: -1,
    min: 1,
  };
  const basicPanel = new this.basic.Panel(stripInfo);
  const { paperColor } = args;

  do {
    this.linkList.push(
      (sX = {}),
      (sY = {}),
      (minSX = { add: [sX], max: minSX }),
      (minSY = { add: [sY], max: minSY }),
    );

    sizeList.push({
      sX,
      sY,
    });
  } while ((i += 1) < count);

  basicPanel.setStage(minSX, minSY);

  i = 0;
  do {
    sizeCurrent = sizeList[i];
    current = basicPanel[panelsInfo[i].method || "draw"]({
      i,
      rel: i / (count - 1),
      sX: sizeCurrent.sX,
      sY: sizeCurrent.sY,
      minSX,
      minSY,
      info: panelsInfo[i],
    });

    // Rounded Border
    if (
      stripInfo.roundCorners ||
      stripInfo.roundTopCorners ||
      stripInfo.roundBottomCorners
    ) {
      current.list.push({
        minX: 6,
        minY: 6,
        list: [
          (stripInfo.roundCorners || stripInfo.roundTopCorners) && {
            name: "Dot",
            color: paperColor,
          },
          (stripInfo.roundCorners || stripInfo.roundTopCorners) && {
            name: "Dot",
            fX: true,
            color: paperColor,
          },
          (stripInfo.roundCorners || stripInfo.roundBottomCorners) && {
            name: "Dot",
            fY: true,
            color: paperColor,
          },
          (stripInfo.roundCorners || stripInfo.roundBottomCorners) && {
            name: "Dot",
            fX: true,
            fY: true,
            color: paperColor,
          },
        ],
      });
    }

    panels.push(current);
  } while ((i += 1) < count);

  return {
    mask: true,
    gutterX,
    gutterY,
    imgRatio: 1.5,
    panels,
  };
};
// END Strip \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/

// BEGINN Panel /\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-/\-
TableComic.prototype.Panel = function (args) {
  this.background = args.background || new this.basic.Background({});

  this.ratio = args.ratio || 1;
};

TableComic.prototype.Panel.prototype.setStage = function (
  minPanelSX,
  minPanelSY,
) {
  this.getSizeWithRatio(
    (this.minPanelSX = minPanelSX),
    (this.minPanelSY = minPanelSY),
    "minSX",
    "minSY",
  );
};

TableComic.prototype.Panel.prototype.draw = function (args) {
  const info = args.info || {};
  const zoomSX = (this.zoomSX = this.pushLinkList({
    r: 1,
    useSize: this.minSX,
  }));
  const zoomSY = (this.zoomSY = this.pushLinkList({
    r: 1,
    useSize: this.minSY,
  }));

  const restSX = this.pushLinkList({
    add: [args.sX, { r: -1, useSize: zoomSX }],
  });
  const restSY = this.pushLinkList({
    add: [args.sY, { r: -1, useSize: zoomSY }],
  });

  const panXrel = (this.panXrel = this.pushLinkList({
    r: 0.5,
    useSize: restSX,
  }));
  const panYrel = (this.panYrel = this.pushLinkList({
    r: 0.5,
    useSize: restSY,
  }));

  const panX = (this.panX = this.pushLinkList({
    r: 0,
    useSize: zoomSX,
    add: [panXrel],
  }));

  const panY = (this.panY = this.pushLinkList({
    r: 0,
    useSize: zoomSY,
    add: [panYrel],
  }));

  const square = this.pushLinkList({ add: [zoomSX], max: zoomSY });
  const infoList = info.list;
  const l = infoList ? infoList.length : 0;
  let count = 0;
  let current;
  const renderList = [];
  const drawInfo = {
    stageSX: zoomSX,
    stageSY: zoomSY,
    square,
  };

  const background = info.background || this.background;

  while (count < l) {
    current = infoList[count];

    drawInfo.info = current;

    renderList.push(current.what.draw(drawInfo));

    count += 1;
  }

  info.zoomSX = info.zoom;
  info.zoomSY = info.zoom;
  this.addHoverChange(info);

  // this.addHoverChange( [
  // 	[ zoom, sX ],
  // 	[ zoom, sY ],
  // ] );

  return {
    sX: args.sX,
    sY: args.sY,
    mask: true,
    list: [
      // Background
      background.draw({
        panX,
        panY,
        stageSX: zoomSX,
        stageSY: zoomSY,
        info: info.backgroundInfo,
      }),

      // Inner Panel
      {
        sX: zoomSX,
        sY: zoomSY,
        y: panY,
        x: panX,
        // cX: true,
        // cY: true,
        fY: true,
        list: renderList,
      },
    ],
  };
};

TableComic.prototype.Panel.prototype.faceDraw = function (args) {
  const actor = args.info.actor.what;
  const zoomX = (this.zoomX = this.pushLinkList({
    r: 1,
    useSize: this.minPanelSX,
  }));
  const zoomY = (this.zoomY = this.pushLinkList({
    r: 1,
    useSize: this.minPanelSY,
  }));
  const square = this.pushLinkList({ add: [zoomX], max: zoomY });

  this.addHoverChange(args.info);

  if (args.info.actor.pos) {
    args.info.actor.pos.obj.draw({
      stageSX: zoomX,
      stageSY: zoomY,
      square,
      info: {
        posX: 0.5,
        posY: 0,
      },
    });
  }

  // actor.getSizeHead(  );

  return {
    sX: args.sX,
    sY: args.sY,
    list: [
      // args.info.background(),
      // { color: floorBackground ? this.floorColor : this.backgroundColor },

      // Stage
      {
        sX: zoomX,
        sY: zoomY,
        c: true,
        list: [
          // // Stage Square
          // { color: [args.rel * 255, 70, 0] },

          actor.draw({
            stageSX: zoomX,
            stageSY: zoomY,
            zoomToHead: true,
            info: args.info.actor,
          }),
        ],
      },
    ],
  };
};
// END Panel \/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/.\/
