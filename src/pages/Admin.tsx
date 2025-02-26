import { onValue, ref, set } from "firebase/database"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase"
import { useEffect, useState } from "react"
import { QueueType } from "../types"

export default function Admin() {
  const { qId, adminId } = useParams()
  const navigate = useNavigate()
  const [queue, setQueue] = useState(null as QueueType | null)

  onValue(ref(db, `queues/${qId}`), snapshot => {
    const queueData = snapshot.val()
    if (queueData === null) {
      navigate("/")
    }
    
    if (!queue || (queue.participants && queueData.participants.length !== queue.participants.length)) {
      setQueue(queueData)
    }
  })

  useEffect(() => {
    if (queue && adminId !== queue.adminId) {
      navigate("/")
    }
  }, [queue])

  if (!queue) return <h1>Loading</h1>

  let custsLeft
  if (queue.participants) {
    let currInd = queue.participants && queue.participants.indexOf(queue.currentPosition)
    custsLeft = queue.participants ? queue.participants.slice(currInd === -1 ? 0 : currInd + 1).length : 0
  } else {
    custsLeft = 0 
  }

  function inviteNext() {
    if (Array.isArray(queue?.participants)) {
      const nextNum = queue.participants[queue?.participants.indexOf(queue.currentPosition) + 1]
      queue.currentPosition = nextNum

      set(ref(db, `queues/${qId}`), queue)
    }
  }

  return (
    <>
      <p>{custsLeft} in the queue</p>
      <p>Current Number: {queue.currentPosition}</p>
      <button onClick={inviteNext}>Invite Next Guest</button>
    </>
  )
}