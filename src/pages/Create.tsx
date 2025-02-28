import { useRef, useState } from "react"
import logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom"
import { randStr } from "../utils"
import { ref, set } from "firebase/database"
import { db } from "../firebase"
import { QueueType } from "../types"

export default function Create() {
  const qNameRef = useRef(null as null | HTMLInputElement)
  const navigate = useNavigate()
  const [btnDisabled, setBtnDisabled] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBtnDisabled(true)

    const qId = Math.floor(Math.random() * (999999 - 100001) + 100000);
    const adminId = randStr()

    if (qNameRef.current) {

      const queueObj : QueueType = {
        currentPosition: 100,
        adminId: adminId,
        queueName: qNameRef.current.value ? qNameRef.current.value : "Unnamed",
        participants: false,
        waitTimes: [0],
        enterTimes: {init: 1}
      }

      try {
        await set(ref(db, `queues/${qId}`), queueObj)
        navigate(`/a/${qId}/${adminId}`)
      } catch (err) {
        console.log("failed to make queue")
      }

    }
  }
  return (
    <>
      <img className="w-1/4 max-w-40 mt-20"
        src={logo} alt="Logo" />

      <form className="w-full flex flex-col items-center mt-14"
        onSubmit={handleSubmit}>
        <input className="rect px-3 text-primary-purple placeholder:text-primary-purple/70 focus:outline-primary-purple" type="text" placeholder="Queue name" ref={qNameRef} />
        <button className="rect bg-primary-purple text-white mt-6"
          disabled={btnDisabled}>Create</button>
      </form>
    </>
  )
}