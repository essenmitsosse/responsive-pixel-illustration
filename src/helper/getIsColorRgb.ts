import type { ColorRgb } from './typeColor'

const getIsColorRgb = (color: unknown): color is ColorRgb =>
  Array.isArray(color) &&
  color.length === 3 &&
  color.every((colorInner) => typeof colorInner === 'number')

export default getIsColorRgb
