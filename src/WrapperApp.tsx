import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StrictMode } from 'react'
import listConfigRouter from './listConfigRouter'

const router = createBrowserRouter(listConfigRouter)

const WrapperApp = () => (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

export default WrapperApp
