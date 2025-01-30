import type { ColorRgb } from '@/helper/typeColor'

export const colorWhite: ColorRgb = [200, 200, 200]

export const colorBlack: ColorRgb = [20, 20, 20]

export const recordColor: Record<
  | 'c1'
  | 'c1D'
  | 'c2'
  | 'c2D'
  | 'c3'
  | 'c3D'
  | 'c4'
  | 'c4D'
  | 'c5'
  | 'c5D'
  | 'c6'
  | 'c6D',
  ColorRgb
> = {
  c1: [200, 20, 20],
  c2: [20, 200, 20],
  c3: [20, 0, 200],
  c4: [200, 200, 20],
  c5: [20, 200, 200],
  c6: [200, 20, 200],
  c1D: [150, 20, 20],
  c2D: [20, 150, 20],
  c3D: [20, 0, 150],
  c4D: [150, 150, 20],
  c5D: [20, 150, 150],
  c6D: [150, 20, 150],
}
