import type { RouteObject } from 'react-router-dom'
import Image from './views/Image'

const listConfigRouter: Array<RouteObject> = [
  {
    index: true,
    element: <Image />,
  },
  {
    path: ':idImage',
    element: <Image />,
  },
]

export default listConfigRouter
