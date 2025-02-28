import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { useTranslation } from "react-i18next"


export default function Home() {
  const navigate = useNavigate()
  const {t} = useTranslation()

  return (
    <>
      <h1 className="my-20 text-primary-purple font-bold">{t("greeting")}</h1>
      <img className="w-1/4 max-w-40"
        src={logo} alt="Logo" />

      <button className="rect bg-secondary-purple text-primary-purple mt-14"
        >Join Queue</button>
      <button className="rect bg-primary-purple text-white mt-6"
      onClick={() => navigate("/create")}>Setup Queue</button>
    </>
  )
}