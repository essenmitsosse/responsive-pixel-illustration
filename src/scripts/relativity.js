function relativity() {
  let c1 = [255, 0, 0]
  let c2 = [0, 255, 0]
  let c3 = [0, 0, 255]
  let c4 = [0, 255, 255]
  let backgroundColor = [50, 50, 50]
  let renderList = [
    {
      m: 'border',
      list: [
        { s: 's', color: c1 },
        { s: 's', color: c1, fX: true },

        { s: 's', y: { r: 1.5, useSize: 's' }, color: c2 },
        {
          s: 's',
          x: { r: 2, useSize: 's' },
          y: { r: 1.5, useSize: 's' },
          color: c2,
        },

        {
          sY: 's',
          sX: { r: 0.33 },
          y: { r: 3, useSize: 's' },
          color: c3,
        },
        {
          sY: 's',
          sX: { r: 0.33 },
          y: { r: 3, useSize: 's' },
          fX: true,
          color: c3,
        },

        {
          stripes: { strip: 's', gap: 's' },
          sY: 's',
          y: { r: 4.5, useSize: 's' },
          color: c4,
        },
      ],
    },
  ]
  let variableList = {
    border: { r: 0.1, height: true },
    imgHeight: {
      r: 1,
      height: true,
      add: [{ r: -2, useSize: 'border' }],
    },
    s: { height: true, r: 0.15, useSize: 'imgHeight' },
  }

  return {
    renderList,
    background: backgroundColor,
    variableList,
  }
}

export default relativity
