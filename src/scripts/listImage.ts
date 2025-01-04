import type { DoHover } from '@/helper/typeHover'
import type { InputDynamicVariable } from '@/helper/typeSize'
import type { CreateSlider } from '@/helper/typeSlider'

export type Link = {
  autoUpdate?: boolean
  calculated?: boolean
  getLinkedVariable?: () => number
  height?: boolean
  main?: boolean
  r?: number
  random?: number
  real?: number
  s?: { getReal: () => number }
}

export type LinkList = ReadonlyArray<Link>

export type RecordVariable = Record<string, InputDynamicVariable>

export type ImageContent = {
  // TODO: Add proper type here (`ColorRGB`)
  background: ReadonlyArray<number> | { get: () => ReadonlyArray<number> }
  hover?: boolean
  linkList?: LinkList
  listDoHover?: ReadonlyArray<DoHover>
  recommendedPixelSize?: number
  renderList: unknown
  variableList?: RecordVariable
}

export type ImageFunction = (
  queryString: Record<string, boolean | number | undefined>,
  currentSlite: DataImage,
  createSlider?: CreateSlider,
) => ImageContent

export type DataImage = {
  both?: true
  hasRandom?: boolean
  import: () => Promise<{ default: ImageFunction }>
  name: string
  niceName: string
  p?: number
  resizeable?: boolean
  showPerson?: boolean
  sliders?: boolean
  timer?: boolean
  unchangeable?: boolean
}

const listImage: ReadonlyArray<DataImage> = [
  {
    import: () => import('./graien'),
    name: 'graien',
    niceName: 'The Three Graeae',
    resizeable: true,
    unchangeable: true,
    sliders: true,
  },
  {
    import: () => import('./tantalos'),
    name: 'tantalos',
    niceName: 'Tantalos',
    resizeable: true,
  },
  {
    import: () => import('./teiresias'),
    name: 'teiresias',
    niceName: 'Teiresias',
    resizeable: true,
  },
  {
    import: () => import('./brothers'),
    name: 'brothers',
    niceName: 'Brothers',
    resizeable: true,
  },
  {
    import: () => import('./zeus'),
    name: 'zeus',
    niceName: 'Zeus',
    resizeable: true,
  },
  {
    import: () => import('./argos'),
    name: 'argos',
    niceName: 'The Argos',
    resizeable: true,
  },
  {
    import: () => import('./sphinx'),
    name: 'sphinx',
    niceName: 'The Sphinx',
    resizeable: true,
  },
  {
    import: () => import('./letter'),
    name: 'letter',
    niceName: 'Letter',
    unchangeable: true,
    both: true,
  },
  {
    import: () => import('./persons-and-trees/init'),
    name: 'persons_lessrandom',
    niceName: 'Trees',
    hasRandom: true,
  },
  {
    import: () => import('./persons-and-trees/init'),
    name: 'persons_lessrandom',
    niceName: 'Persons',
    sliders: true,
    showPerson: true,
    hasRandom: true,
  },
  {
    import: () => import('./panels/init-panels'),
    name: 'panels',
    niceName: 'Panels',
    unchangeable: true,
    sliders: true,
    hasRandom: true,
  },
  {
    import: () => import('./turnAround/init'),
    name: 'turnaround',
    niceName: 'Turnaround',
    unchangeable: true,
    sliders: true,
    hasRandom: true,
  },
  {
    import: () => import('./comic/init'),
    name: 'comic',
    niceName: 'Comic',
    unchangeable: true,
    sliders: true,
    hasRandom: true,
  },
  {
    import: () => import('./relativity'),
    name: 'relativity',
    niceName: 'Relativity',
    resizeable: true,
  },
  {
    import: () => import('./stripes'),
    name: 'stripes',
    niceName: 'Stripe',
    resizeable: true,
  },
  {
    import: () => import('./landscape'),
    name: 'landscape',
    niceName: 'Landscape',
    resizeable: true,
    hasRandom: true,
  },
  {
    import: () => import('./sparta'),
    name: 'sparta',
    niceName: 'Sparta',
    resizeable: true,
  },
  {
    import: () => import('./trex'),
    name: 'trex',
    niceName: 'T-Rex',
    resizeable: true,
  },
  {
    import: () => import('./typo'),
    name: 'typo',
    niceName: 'Typo',
    resizeable: true,
  },
  {
    name: 'random-distribution',
    import: () => import('./random-distribution'),
    niceName: 'Random',
    hasRandom: true,
    resizeable: true,
  },
]

export default listImage
