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
import Join from './pages/Create'
import NotFound from './components/NotFound'


function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path='/' element={<Home />} />
      <Route path='/a/:qId/:adminId' element={<Admin />} />
      <Route path='/:qId' element={<InQueue />} />
      <Route path='/create' element={<Join />} />
      <Route path='*' element={<NotFound message='Page does not exist' />} />
    </>
  ))

  return (
    <>
    <main className='font-inter w-full max-w-4xl mx-auto mb-8 flex flex-col items-center'>
      <RouterProvider router={router} />
    </main>
    </>
  )
}

export default App
