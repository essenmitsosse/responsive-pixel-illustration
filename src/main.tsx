import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import Image from './views/Image'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const $root = document.getElementById('root')

if ($root !== null) {
  createRoot($root).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Image idImage="tantalos" />} />
            <Route path=":idImage" element={<Image />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  )
}
