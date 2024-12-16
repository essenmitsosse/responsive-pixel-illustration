type ImageFunction =
  | ((
      queryString: Record<string, boolean | number>,
      currentSlite: DataImage,
      createSlider: {
        number: () => void
        slide: () => void
        title: () => void
      },
    ) => unknown)
  | (new (
      queryString: Record<string, boolean | number>,
      currentSlite: DataImage,
      createSlider: {
        number: () => void
        slide: () => void
        title: () => void
      },
    ) => unknown)

type DataImage = {
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
    import: () => import('./graien.js'),
    name: 'graien',
    niceName: 'The Three Graeae',
    resizeable: true,
    unchangeable: true,
    sliders: true,
  },
  {
    import: () => import('./tantalos.js'),
    name: 'tantalos',
    niceName: 'Tantalos',
    resizeable: true,
  },
  {
    import: () => import('./teiresias.js'),
    name: 'teiresias',
    niceName: 'Teiresias',
    resizeable: true,
  },
  {
    import: () => import('./brothers.js'),
    name: 'brothers',
    niceName: 'Brothers',
    resizeable: true,
  },
  {
    import: () => import('./zeus.js'),
    name: 'zeus',
    niceName: 'Zeus',
    resizeable: true,
  },
  {
    import: () => import('./argos.js'),
    name: 'argos',
    niceName: 'The Argos',
    resizeable: true,
  },
  {
    import: () => import('./sphinx.js'),
    name: 'sphinx',
    niceName: 'The Sphinx',
    resizeable: true,
  },
  {
    import: () => import('./letter.js'),
    name: 'letter',
    niceName: 'Letter',
    unchangeable: true,
    both: true,
  },
  {
    import: () => import('./persons-and-trees/init.js'),
    name: 'persons_lessrandom',
    niceName: 'Trees',
    hasRandom: true,
  },
  {
    import: () => import('./persons-and-trees/init.js'),
    name: 'persons_lessrandom',
    niceName: 'Persons',
    sliders: true,
    showPerson: true,
    hasRandom: true,
  },
  {
    import: () => import('./panels/init-panels.js'),
    name: 'panels',
    niceName: 'Panels',
    unchangeable: true,
    sliders: true,
    hasRandom: true,
  },
  {
    import: () => import('./turnAround/init.js'),
    name: 'turnaround',
    niceName: 'Turnaround',
    unchangeable: true,
    sliders: true,
    hasRandom: true,
  },
  {
    import: () => import('./comic/init.js'),
    name: 'comic',
    niceName: 'Comic',
    unchangeable: true,
    sliders: true,
    hasRandom: true,
  },
  {
    import: () => import('./relativity.js'),
    name: 'relativity',
    niceName: 'Relativity',
    resizeable: true,
  },
  {
    import: () => import('./stripes.js'),
    name: 'stripes',
    niceName: 'Stripe',
    resizeable: true,
  },
  {
    import: () => import('./landscape.js'),
    name: 'landscape',
    niceName: 'Landscape',
    resizeable: true,
    hasRandom: true,
  },
  {
    import: () => import('./sparta.js'),
    name: 'sparta',
    niceName: 'Sparta',
    resizeable: true,
  },
  {
    import: () => import('./trex.js'),
    name: 'trex',
    niceName: 'T-Rex',
    resizeable: true,
  },
  {
    import: () => import('./typo.js'),
    name: 'typo',
    niceName: 'Typo',
    resizeable: true,
  },
  {
    name: 'random-distribution',
    import: () => import('./random-distribution.js'),
    niceName: 'Random',
    hasRandom: true,
    resizeable: true,
  },
]

export default listImage
