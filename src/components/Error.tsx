import { Navigate, useLocation } from "react-router-dom"

export default function Error() {
  const location = useLocation()
  return <Navigate to={location.pathname} />
}