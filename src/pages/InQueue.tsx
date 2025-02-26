import { useState } from "react"
import { db } from "../firebase"
import { onValue, ref, runTransaction, set } from "firebase/database"
import { useNavigate, useParams } from "react-router-dom"
import { QueueType } from "../types"

export default function InQueue() {
  const [queue, setQueue] = useState(null as QueueType | null)
  const { qId } = useParams() as { qId: string }
  const navigate = useNavigate()

  if (!localStorage.getItem("myQueues")) localStorage.setItem("myQueues", '{}')
  const myQueues = (JSON.parse(localStorage.getItem("myQueues") || "{}"))

  onValue(ref(db, `queues/${qId}`), snapshot => {
    const queueData = snapshot.val()
    if (queueData === null) {
      navigate("/")
    }

    if (!queue || queue.participants && queueData.participants.length !== queue.participants.length || queueData.currentPosition !== queue.currentPosition) {
      setQueue(queueData)
    }
  })

  if (!queue) return <h1>Loading...</h1>

  function insertToQ() {
    if (!queue) return
    console.log(queue)

    const queueRef = ref(db, `queues/${qId}`)
    runTransaction(queueRef, (currentQueue) => {
      if (currentQueue !== null) {
        if (!currentQueue.participants) {
          myQueues[qId] = 101
          currentQueue.participants = [101]
        } else {
          myQueues[qId] = (currentQueue.participants.at(-1) as number + 1)
          currentQueue.participants.push(myQueues[qId])
        }
      }

      localStorage.setItem("myQueues", JSON.stringify(myQueues))

      return currentQueue
    })
  }

  if (!myQueues[qId]) {
    return (
      <>
        <button onClick={insertToQ}>Enter Queue?</button>
      </>
    )
  }

  let myPosition = 0
  if (Array.isArray(queue.participants)) {
    const startInd = queue.currentPosition > 100 ? queue.participants.indexOf(queue.currentPosition) : 0
    const endInd = queue.participants.indexOf(myQueues[qId])
    myPosition = queue.participants.slice(startInd, endInd).length
  }

  return (
    <>
      <button></button>
    </>
  )

  return (
    <>
      <h1>Your Number {myQueues[qId]}</h1>
      {myPosition > -1
        ? <h1>There are {myPosition} people ahead of you</h1>
        : <h1>It's your turn</h1>}
    </>
  )
}