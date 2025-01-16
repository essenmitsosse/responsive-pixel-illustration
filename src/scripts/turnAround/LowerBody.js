import BBObj from './BBObj'

// LOWER BODY  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class LowerBody extends BBObj {
  draw(args, front, right) {
    return [
      {
        color: [front ? 150 : 100, right ? 150 : 100, front || right ? 0 : 0],
      },
    ]
  }
}

export default LowerBody
