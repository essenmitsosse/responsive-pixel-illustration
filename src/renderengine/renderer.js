export const Renderer = function (canvas, info, options, pixelStarter) {
    // Render Engine to convert basic image into absolute Pixels
    var context = canvas.getContext("2d"),
        virtualCanvas = document.createElement("canvas"),
        virtaulContext = virtualCanvas.getContext("2d"),
        pixelSize = options.pixelSize,
        w,
        h,
        drawer = this.getDrawer(pixelStarter, options.imageFunction.renderList),
        renderPixelToImage = this.getRenderPixelToImage(
            options.imageFunction.background,
        )

    return {
        rescaleWindow: function () {
            w = canvas.offsetWidth
            h = canvas.offsetHeight
        },

        resize: function resize(widthFactor, heightFactor) {
            var countW = Math.round(((widthFactor || 1) * w) / pixelSize),
                countH = Math.round(((heightFactor || 1) * h) / pixelSize),
                image =
                    countW &&
                    countH &&
                    virtaulContext.createImageData(countW, countH),
                drawing,
                time = -1

            if (image && countW > 0 && countH > 0) {
                // Resize Canvas to new Windows-Size
                virtualCanvas.width = countW
                virtualCanvas.height = countH

                canvas.width = w
                canvas.height = h

                // Disable Anti-Alaising
                context.mozImageSmoothingEnabled = false
                context.oImageSmoothingEnabled = false
                context.webkitImageSmoothingEnabled = false
                context.msImageSmoothingEnabled = false
                context.imageSmoothingEnabled = false

                // Render the Image Data to the Pixel Array
                time = Date.now()

                drawing = drawer(countW, countH).get

                time = Date.now() - time

                // Render the Pixel Array to the Image
                renderPixelToImage(countW, countH, drawing, image.data)

                // Place Image on the Context
                virtaulContext.putImageData(image, 0, 0)

                // Draw and upscale Context on Canvas
                context.drawImage(
                    virtualCanvas,
                    0,
                    0,
                    countW * pixelSize,
                    countH * pixelSize,
                )

                // // Log some general Infos for debugging
                // info.change( "Dimensions", w + "px &times; " + h + "px (" + countW + "px &times; " + countH + "px)" );
                // info.change( "Pixel Count", Math.floor ( ( w * h ) / 1000 ) + "kpx ("+ Math.floor( ( countW * countH ) / 1000 ) + "kpx)" );
                // info.change( "Pixel-Size", realPixelSize + " px" );
            }

            return [w, h, time]
        },
    }
}

Renderer.prototype.Color = function () {
    this.s = []
}

Renderer.prototype.Color.prototype.draw = function (c, zInd, id) {
    var i = this.s.length - 1,
        s = this.s,
        oldZInd

    if (i === -1 || (oldZInd = s[i].zInd) < zInd) {
        s.push({ id: id, c: c, zInd: zInd })
    } else {
        if (oldZInd !== zInd) {
            do {
                if (s[i].zInd < zInd) {
                    break
                }
            } while (i--)

            s.splice(i + 1, 0, { id: id, c: c, zInd: zInd })
        }
    }
}

Renderer.prototype.Color.prototype.clear = function (id) {
    var s = this.s

    while (s.length > 0 && s[s.length - 1].id === id) {
        this.s.pop()
    }
}

Renderer.prototype.getPixelArray = function (width, height) {
    var countH,
        colorArray = [],
        Color = this.Color

    while (width--) {
        countH = height
        colorArray[width] = []
        while (countH--) {
            colorArray[width][countH] = new Color()
        }
    }

    return colorArray
}

Renderer.prototype.createPixelArray = function (canvasWidth, canvasHeight) {
    // Create PixelArray
    var pixelArray = this.getPixelArray(canvasWidth, canvasHeight),
        minX = 0,
        minY = 0,
        maxX = canvasWidth,
        maxY = canvasHeight

    return {
        setMask: function (dimensions, push) {
            var old = {
                posX: minX,
                width: maxX - minX,
                posY: minY,
                height: maxY - minY,
            }

            // TODO: Dont check if its the old values;

            maxX = (minX = dimensions.posX) + dimensions.width
            maxY = (minY = dimensions.posY) + dimensions.height

            if (!maxX || maxX > canvasWidth) {
                maxX = canvasWidth
            }
            if (!maxY || maxY > canvasHeight) {
                maxY = canvasHeight
            }
            if (!minX || minX < 0) {
                minX = 0
            }
            if (!minY || minY < 0) {
                minY = 0
            }

            if (push) {
                if (maxX > old.posX + old.width) {
                    maxX = old.posX + old.width
                }
                if (maxY > old.posY + old.height) {
                    maxY = old.posY + old.height
                }
                if (minX < old.posX) {
                    minX = old.posX
                }
                if (minY < old.posY) {
                    minY = old.posY
                }
            }

            return old
        },

        getSet: function (color, zInd, id) {
            return function (x, y) {
                if (x >= minX && x < maxX && y >= minY && y < maxY) {
                    pixelArray[x][y].draw(color, zInd, id)
                }
            }
        },

        getClear: function (id) {
            return function (x, y) {
                if (x >= minX && x < maxX && y >= minY && y < maxY) {
                    pixelArray[x][y].clear(id)
                }
            }
        },

        getSetForRect: function (color, zInd, id) {
            // Set Color for Rectangle for better Performance
            var pA = pixelArray
            return function (args) {
                var posX = args.posX,
                    posY = args.posY,
                    endX = args.width + posX,
                    endY = args.height + posY,
                    sizeX = endX > maxX ? maxX : endX,
                    sizeY,
                    sizeY_start = endY > maxY ? maxY : endY,
                    startX = posX < minX ? minX : posX,
                    startY = posY < minY ? minY : posY,
                    row

                while ((sizeX -= 1) >= startX) {
                    sizeY = sizeY_start
                    row = pA[sizeX]

                    while ((sizeY -= 1) >= startY) {
                        row[sizeY].draw(color, zInd, id)
                    }
                }
            }
        },

        getClearForRect: function (id) {
            var pA = pixelArray
            return function (args) {
                var endX = args.width + args.posX,
                    endY = args.height + args.posY,
                    sizeX = endX > maxX ? maxX : endX,
                    sizeY,
                    initSizeY = endY > maxY ? maxY : endY,
                    startX = args.posX < minX ? minX : args.posX,
                    startY = args.posY < minY ? minY : args.posY,
                    row

                while ((sizeX -= 1) >= startX) {
                    sizeY = initSizeY
                    row = pA[sizeX]
                    while ((sizeY -= 1) >= startY) {
                        row[sizeY].clear(id)
                    }
                }
            }
        },

        getSaveForRect: function (save, mask) {
            return function (args) {
                var endX = args.width + args.posX,
                    endY = args.height + args.posY,
                    sizeX = endX > canvasWidth ? canvasWidth : endX,
                    sizeY,
                    initSizeY = endY > canvasHeight ? canvasHeight : endY,
                    startX = args.posX < 0 ? 0 : args.posX,
                    startY = args.posY < 0 ? 0 : args.posY,
                    s = save,
                    col

                while ((sizeX -= 1) >= startX) {
                    sizeY = initSizeY

                    col = mask[sizeX] || (mask[sizeX] = [])

                    while ((sizeY -= 1) >= startY) {
                        s.push([sizeX, sizeY])
                        col[sizeY] = true
                    }
                }
            }
        },

        getClearSaveForRect: function (save, mask) {
            return function (args) {
                var endX = args.width + args.posX,
                    endY = args.height + args.posY,
                    sizeX = endX > canvasWidth ? canvasWidth : endX,
                    sizeY,
                    initSizeY = endY > canvasHeight ? canvasHeight : endY,
                    startX = args.posX < 0 ? 0 : args.posX,
                    startY = args.posY < 0 ? 0 : args.posY,
                    col

                while ((sizeX -= 1) >= startX) {
                    sizeY = initSizeY

                    if ((col = mask[sizeX])) {
                        while ((sizeY -= 1) >= startY) {
                            if (col[sizeY]) {
                                col[sizeY] = false
                            }
                        }
                    }
                }
            }
        },

        get: pixelArray,
    } // Return prepared Color-Array, with default Color;
}

Renderer.prototype.getRenderPixelToImage = function (backgroundColor) {
    return function renderPixelToImage(pixelW, pixelH, pixelArray, imageData) {
        var pW = pixelW,
            w4 = pW * 4,
            wFull = w4,
            pH,
            pHSave = pixelH,
            fullSave = w4 * pHSave,
            full,
            c,
            i,
            row,
            pA = pixelArray,
            defaultRed = backgroundColor && backgroundColor[0],
            defaultGreen = backgroundColor && backgroundColor[1],
            defaultBlue = backgroundColor && backgroundColor[2]

        while (pW--) {
            w4 -= 4
            pH = pHSave
            full = fullSave
            row = pA[pW]
            while (pH--) {
                if ((c = row[pH].s.pop())) {
                    c = c.c

                    imageData[(i = w4 + (full -= wFull))] = c[0]
                    imageData[(i += 1)] = c[1]
                    imageData[(i += 1)] = c[2]
                    imageData[(i += 1)] = 255
                } else if (backgroundColor) {
                    imageData[(i = w4 + (full -= wFull))] = defaultRed
                    imageData[(i += 1)] = defaultGreen
                    imageData[(i += 1)] = defaultBlue
                    imageData[(i += 1)] = 255
                } else {
                    imageData[(i = w4 + (full -= wFull) + 3)] = 0
                }
            }
        }

        return imageData
    }
}

Renderer.prototype.getDrawer = function (pixelStarter, renderList) {
    // Initialize the drawingTool
    var that = this,
        pixelUnit = pixelStarter.pixelUnits,
        drawingTool = new pixelStarter.DrawingTools(
            pixelUnit,
            pixelStarter.getRandom,
        ),
        canvasTool = new drawingTool.Obj().create({ list: renderList })

    return function drawer(countW, countH) {
        var pixelArray = that.createPixelArray(countW, countH)

        drawingTool.init(countW, countH, pixelArray)
        canvasTool.draw()

        return pixelArray
    }
}
