import { useTranslation } from "react-i18next"


function chLang(code : string) {
  
}

export default function LangSelector() {
  const {i18n} = useTranslation()

  return (
    <div>
      <button className={i18n.language === "en" ? "bg-primary-purple" : "bg-secondary-purple"}>English</button>
      <button className={i18n.language === "en" ? "bg-primary-purple" : "bg-secondary-purple"}>Kinyarwanda</button>
    </div>
  )
}