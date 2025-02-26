import { useEffect, useState } from "react"
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
      delete myQueues[qId]
      localStorage.setItem("myQueues", JSON.stringify(myQueues))
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


  let myPosition = 0
  if (Array.isArray(queue.participants)) {
    if (queue.currentPosition > 100) {
      const startInd = queue.participants.indexOf(queue.currentPosition)
      const endInd = queue.participants.indexOf(myQueues[qId])
      myPosition = queue.participants.slice(startInd, endInd).length
    } else {
      myPosition = queue.participants.length
    }
  }

  if (!myQueues[qId]) {
    return (
      <>
        <p className="mt-36 text-primary-purple font-bold">You are about to join queue: "{queue.queueName}"</p>
        <button className="rect mt-6"
          onClick={insertToQ}>Join</button>
      </>
    )
  }

  const frmtMyPosition = myPosition.toString().at(-1) === "1" ? myPosition + "st" : myPosition.toString().at(-1) === "2" ? myPosition + "nd" : myPosition.toString().at(-1) === "3" ? myPosition + "rd" : myPosition + "th"

  async function quitQueue() {
    if (myQueues[qId] && queue?.participants){
      setQueue({...queue, participants: queue.participants.filter(i => i !== myQueues[qId])})
      delete myQueues[qId]
      localStorage.setItem("myQueues", JSON.stringify(myQueues))
      set(ref(db, `queues/${qId}`), queue)
      navigate("/")
    }
  }

  
  return (
    <>
      <div className={`w-10/12 max-w-sm aspect-square border-[24px] rounded-full mt-28 ${myPosition > 0 ? "border-primary-purple" : "border-primary-green"}`}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
          <p>Your number is #{myQueues[qId]}</p>
          {
            myPosition > 0
              ? <h1 className="text-4xl font-bold text-center">You are {frmtMyPosition} in the queue</h1>
              : <h1 className="text-4xl font-bold text-center">It's your turn now!</h1>
          }
          <p>-{myPosition > 0 ? "almost there!" : "You're invited!"}</p>
        </div>
      </div>
      
        <button className={`rect text-white mt-10 ${myPosition > 0 ? "bg-primary-purple" : "bg-primary-green border-primary-green"}`}
        onClick={quitQueue}>Quit Queue</button>
    </>
  )

  return (
    <>
      <h1>Your Number {myQueues[qId]}</h1>
      {myPosition > 0
        ? <h1>You are number {myPosition} in line</h1>
        : <h1>It's your turn</h1>}
    </>
  )
}