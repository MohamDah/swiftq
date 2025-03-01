import './App.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import InQueue from './pages/InQueue'
import NotFound from './components/NotFound'
import Create from './pages/Create'
import Join from './pages/Join'
import Layout from './components/Layout'
import { useContext } from 'react'
import ColorContext from './components/ColorContext'
import Translate from './components/Translate'


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>

      <Route path='/' element={<Home />} />
      <Route path='/a/:qId/:adminId' element={<Admin />} />
      <Route path='/:qId' element={<InQueue />} />
      <Route element={<Layout />}>
        <Route path='/create' element={<Create />} />
        <Route path='/join' element={<Join />} />
      </Route>
      <Route path='*' element={<NotFound message='Page not found' />} />
    </>
  ))

  const {color} = useContext(ColorContext)

  

  return (
    <>
    
      <main className={`relative font-inter w-full mx-auto flex flex-col items-center h-[100svh] border bg-gradient-to-tl via-50% via-transparent ${color === "purple" ? "from-primary-purple/60 to-secondary-purple" : "from-primary-green/75 to-primary-green/30"}`}>
        <RouterProvider router={router} />
        <Translate />
      </main>
    </>
  )
}

export default App
