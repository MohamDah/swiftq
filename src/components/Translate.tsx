import { useEffect, useState } from "react"

export default function Translate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => setShow(false), 10000)
      return () => clearTimeout(timeout)
    }

  }, [show])

  function chLang(code: string) {
    window.location.href = `#googtrans(${code})`
    location.reload()
  }

  return (
    <div className="absolute top-4 w-10/12 max-w-md flex">

      <div className=" flex h-8 xs:h-10 rounded-lg bg-white overflow-hidden shadow-lg">
        <button className="px-3 xs:px-4" onClick={() => setShow(!show)}><i className="fa-solid fa-globe"></i></button>
        <button onClick={() => chLang("en")}
          className={`hover:bg-secondary-purple transition-all duration-500 overflow-hidden text-sm xs:text-base ${show ? "w-20 xs:w-28" : "w-0"}`}>English</button>
        <button onClick={() => chLang("rw")}
          className={`hover:bg-secondary-purple transition-all duration-500 overflow-hidden text-sm xs:text-base ${show ? "w-28 xs:w-32" : "w-0"}`}>Kinyarwanda</button>
      </div>
    </div>
  )
}