import { useRef } from "react"
// import { firebase } from "../firebase"
import { db } from "../firebase"
import { onValue, ref, set } from "firebase/database"
import { randStr } from "../utils"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"

export default function Home() {
  const qNameRef = useRef(null as any)
  const navigate = useNavigate()


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log(qNameRef.current.value)

    const qId = Math.floor(Math.random() * (999999 - 100001) + 100000);
    const adminId = randStr()

    console.log(adminId)
    const queueObj = {
      currentPosition: 100,
      adminId: adminId,
      queueName: qNameRef.current.value,
      participants: false,
    }

    await set(ref(db, `queues/${qId}`), queueObj)

    navigate(`/a/${qId}/${adminId}`)

  }


  return (
    <>
      <h1 className="my-20 text-primary-purple font-bold">WELCOME</h1>
      <img className="w-1/4 max-w-40"
        src={logo} alt="Logo" />

      <button className="rect bg-secondary-purple text-primary-purple mt-14"
        >Join Queue</button>
      <button className="rect bg-primary-purple text-white mt-6"
      onClick={() => navigate("/create")}>Setup Queue</button>
    </>
  )
}