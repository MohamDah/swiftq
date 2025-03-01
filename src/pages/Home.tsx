import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { useContext, useEffect } from "react"
import ColorContext from "../components/ColorContext"


export default function Home() {
  const navigate = useNavigate()
  const {setColor} = useContext(ColorContext)

  useEffect(() => setColor("purple"))

  return (
    <>
      <h1 className="mt-20 text-primary-purple font-bold">WELCOME</h1>
      <img className="w-1/4 max-w-40 mt-14 xs:mt-20"
        src={logo} alt="Logo" />

      <button className="rect bg-secondary-purple text-primary-purple mt-10 xs:mt-14"
      onClick={() => navigate("/join")}>Join Queue</button>
      <button className="rect bg-primary-purple text-white mt-6"
        onClick={() => navigate("/create")}>Setup Queue</button>
    </>
  )
}