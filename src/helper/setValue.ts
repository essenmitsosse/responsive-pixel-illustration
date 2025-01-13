import type { InputDynamicVariableBase } from './typeSize'
import type { LinkPrepared } from '@/renderengine/PixelGraphics'

const setValue = (
  what: InputDynamicVariableBase & LinkPrepared,
  value?: number | void,
): void => {
  if (what.s === undefined) {
    throw new Error(
      'Unexpected error: variable has not been initialized, s is undefined',
    )
  }

  what.s.rele = value ?? undefined
}

export default setValue
