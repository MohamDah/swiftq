
import { useRef, useState } from "react"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom"
import { get, ref } from "firebase/database"
import { db } from "../firebase"

export default function Join() {
  const qIdRef = useRef(null as null | HTMLInputElement)
  const navigate = useNavigate()
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [err, setErr] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBtnDisabled(true)
    if (qIdRef.current) {
      const queue = await get(ref(db, `queues/${qIdRef.current.value}`))
      if (queue.val()) {
        navigate(`/${qIdRef.current.value}`)
      } else {
        setErr(true)
      }
    }
    setBtnDisabled(false)
  }
  return (
    <>
      <img className="w-1/4 max-w-40 mt-20"
        src={logo} alt="Logo" />

      <form className="w-full flex flex-col items-center mt-14"
        onSubmit={handleSubmit}>
        {err && <p className="text-red-600 font-bold">No queue with that code</p>}
        <input className="rect px-3 text-primary-purple placeholder:text-primary-purple/70 focus:outline-primary-purple" type="text" placeholder="Queue Code" ref={qIdRef} />
        <button className={"rect mt-6 " + (btnDisabled ? "bg-secondary-purple text-primary-purple" : "bg-primary-purple text-white")}
          disabled={btnDisabled}>Join</button>
      </form>
    </>
  )
}