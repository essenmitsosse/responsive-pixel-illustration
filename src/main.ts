import { createRoot } from 'react-dom/client'
import './index.css'
import WrapperApp from './WrapperApp'

const $root = document.getElementById('root')

if ($root !== null) {
  createRoot($root).render(WrapperApp())
}
