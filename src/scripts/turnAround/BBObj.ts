import type { StateTurnAround } from './types'
import type { InputDynamicVariable } from '@/helper/typeSize'

class BBObj {
  declare ll: Array<InputDynamicVariable>

  declare state: StateTurnAround

  constructor(state: StateTurnAround) {
    this.state = state

    this.ll = state.ll
  }
}

export default BBObj
