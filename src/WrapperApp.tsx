import './index.css'
import App from './App'
import Image from './views/Image'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StrictMode } from 'react'

const WrapperApp = () => (
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Image idImage="tantalos" />} />
          <Route path=":idImage" element={<Image />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

export default WrapperApp
