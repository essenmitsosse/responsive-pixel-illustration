const listImage: ReadonlyArray<{
  both?: true
  hasRandom?: boolean
  import: () => Promise<unknown>
  name: string
  niceName: string
  resizeable?: boolean
  showPerson?: boolean
  sliders?: boolean
  unchangeable?: boolean
}> = [
  {
    import: (): Promise<unknown> => import('./graien.js'),
    name: 'graien',
    niceName: 'The Three Graeae',
    resizeable: true,
    unchangeable: true,
    sliders: true,
  },
  {
    import: (): Promise<unknown> => import('./tantalos.js'),
    name: 'tantalos',
    niceName: 'Tantalos',
    resizeable: true,
  },
  {
    import: (): Promise<unknown> => import('./teiresias.js'),
    name: 'teiresias',
    niceName: 'Teiresias',
    resizeable: true,
  },
  {
    import: (): Promise<unknown> => import('./brothers.js'),
    name: 'brothers',
    niceName: 'Brothers',
    resizeable: true,
  },
  {
    import: (): Promise<unknown> => import('./zeus.js'),
    name: 'zeus',
    niceName: 'Zeus',
    resizeable: true,
  },
  {
    import: (): Promise<unknown> => import('./argos.js'),
    name: 'argos',
    niceName: 'The Argos',
    resizeable: true,
  },
  {
    import: (): Promise<unknown> => import('./sphinx.js'),
    name: 'sphinx',
    niceName: 'The Sphinx',
    resizeable: true,
  },
  {
    import: (): Promise<unknown> => import('./letter.js'),
    name: 'letter',
    niceName: 'Letter',
    unchangeable: true,
    both: true,
  },
  {
    import: (): Promise<unknown> => import('./persons-and-trees/init.js'),
    name: 'persons_lessrandom',
    niceName: 'Trees',
    hasRandom: true,
  },
  {
    import: (): Promise<unknown> => import('./persons-and-trees/init.js'),
    name: 'persons_lessrandom',
    niceName: 'Persons',
    sliders: true,
    showPerson: true,
    hasRandom: true,
  },
  {
    import: (): Promise<unknown> => import('./panels/init-panels.js'),
    name: 'panels',
    niceName: 'Panels',
    unchangeable: true,
    sliders: true,
    hasRandom: true,
  },
  {
    import: (): Promise<unknown> => import('./turnAround/init.js'),
    name: 'turnaround',
    niceName: 'Turnaround',
    unchangeable: true,
    sliders: true,
    hasRandom: true,
  },
  {
    import: (): Promise<unknown> => import('./comic/init.js'),
    name: 'comic',
    niceName: 'Comic',
    unchangeable: true,
    sliders: true,
    hasRandom: true,
  },
  {
    import: (): Promise<unknown> => import('./relativity.js'),
    name: 'relativity',
    niceName: 'Relativity',
    resizeable: true,
  },
  {
    import: (): Promise<unknown> => import('./stripes.js'),
    name: 'stripes',
    niceName: 'Stripe',
    resizeable: true,
  },
  {
    import: (): Promise<unknown> => import('./landscape.js'),
    name: 'landscape',
    niceName: 'Landscape',
    resizeable: true,
    hasRandom: true,
  },
  {
    import: (): Promise<unknown> => import('./sparta.js'),
    name: 'sparta',
    niceName: 'Sparta',
    resizeable: true,
  },
  {
    import: (): Promise<unknown> => import('./trex.js'),
    name: 'trex',
    niceName: 'T-Rex',
    resizeable: true,
  },
  {
    import: (): Promise<unknown> => import('./typo.js'),
    name: 'typo',
    niceName: 'Typo',
    resizeable: true,
  },
  {
    name: 'random-distribution',
    import: (): Promise<unknown> => import('./random-distribution.js'),
    niceName: 'Random',
    hasRandom: true,
    resizeable: true,
  },
]

export default listImage
