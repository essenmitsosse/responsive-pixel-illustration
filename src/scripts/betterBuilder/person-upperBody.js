import { BBObj } from "./object.js"

// CHEST  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export const Chest = function (args) {
    this.color = args.color
    this.colorDark = args.colorDark
} // End Chest

Chest.prototype = new BBObj()
Chest.prototype.draw = function (args, front, right) {
    return [
        {
            color: [
                front ? 200 : 150,
                right ? 200 : 150,
                front || right ? 0 : 0,
            ],
        },
    ]
} // End Chest Draw - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
