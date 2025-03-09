
import { Outlet } from "react-router-dom";
import Translate from "./Translate";

export default function OuterLayout() {
 
  return (
    <>
      <Outlet />
      {/* <Translate /> */}
    </>
  )
}