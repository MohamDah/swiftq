import { useRef } from "react"
// import { firebase } from "../firebase"
import { db } from "../firebase"
import { onValue, ref, set } from "firebase/database"
import { randStr } from "../utils"
import { useNavigate } from "react-router-dom"

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

  async function listData() {
  }

  onValue(ref(db, "queues/587046"), snapshot => {
    console.log(snapshot.val())
  })

  return (
    <>
      <h1>Home page</h1>
      <form className="*:border" onSubmit={handleSubmit}>
        <label>Enter Queue Name</label>
        <input name="queueName" type="text" ref={qNameRef} />
        <button className="">Submit</button>
      </form>
      <button onClick={listData}>list data</button>
    </>
  )
}