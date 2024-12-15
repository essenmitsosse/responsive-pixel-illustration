import type { SizeHover } from './typeSize'

const setValue = <TRele>(what: SizeHover<TRele>, value: TRele): void => {
  what.s.rele = value
}

export default setValue
