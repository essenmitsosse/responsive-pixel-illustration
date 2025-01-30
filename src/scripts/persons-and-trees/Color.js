const Color = function (nr, br) {
  this.nr = nr

  this.br = br
}

Color.prototype.copy = function (args) {
  args = args || {}

  const color = new Color(args.nr !== undefined ? args.nr : this.nr, this.br)

  if (args.nextColor) {
    color.nextColor()
  } else if (args.prevColor) {
    color.prevColor()
  }

  if (args.brSet !== undefined) {
    color.brightnessSet(args.brSet)
  } else if (args.brAdd) {
    color.brightnessAdd(args.brAdd)
  } else if (args.brContrast) {
    color.brightnessContrast(args.brContrast, args.min, args.max)
  }

  if (args.min && color.br < args.min) {
    color.br = args.min
  }

  if (args.max && color.br > args.max) {
    color.br = args.max
  }

  if (args.dontChange) {
    color.dontChange = true
  }

  return color
}

Color.prototype.nextColor = function () {
  this.nr += 1

  if (this.nr > 2) {
    this.nr = 0
  }
}

Color.prototype.prevColor = function () {
  this.nr -= 1

  if (this.nr < 0) {
    this.nr = 2
  }
}

Color.prototype.brightnessAdd = function (add) {
  this.br += add

  if (this.br < 0) {
    this.br = 0
  } else if (this.br > 5) {
    this.br = 5
  }
}

Color.prototype.brightnessSet = function (set) {
  this.br = set

  if (this.br < 0) {
    this.br = 0
  } else if (this.br > 5) {
    this.br = 5
  }
}

Color.prototype.brightnessContrast = function (add, min, max) {
  min = min || 0

  max = max || 5

  if (add < 0) {
    this.br += this.br + add < min ? -add : add
  } else {
    this.br += this.br + add > max ? -add : add
  }

  if (this.br < min) {
    this.br = min
  } else if (this.br > max) {
    this.br = max
  }
}

Color.prototype.getNormal = function () {
  if (!this.finalColor) {
    return (this.finalColor = this.colors[this.nr][this.br] || [200, 0, 155])
  }

  return this.finalColor
}

Color.prototype.get = Color.prototype.getNormal

Color.prototype.getBr = function () {
  return this.br
}

export default Color
