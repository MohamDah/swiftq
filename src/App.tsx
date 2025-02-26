import './App.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import InQueue from './pages/InQueue'


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path='/' element={<Home />} />
      <Route path='/a/:qId/:adminId' element={<Admin />} />
      <Route path='/:qId' element={<InQueue />} />
      <Route path='*' element={<Navigate to={"/"} />} />
    </>
  ))

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
