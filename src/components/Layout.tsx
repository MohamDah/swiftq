import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate()
 
  return (
    <>
      <button className='w-10/12 max-w-md text-start mt-12 mb-5 text-primary-purple underline'
      onClick={() => navigate("/")}><i className="fa-solid fa-left-long"></i> Go Home</button>
      <Outlet />
    </>
  )
}