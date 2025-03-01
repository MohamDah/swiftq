import { useState } from "react"

export default function toEnter() {
  const [btnDisabled, setBtnDisabled] = useState(false)


  async function insertToQ() {
      if (!queue) return
  
      setBtnDisabled(true)
  
      const queueRef = ref(db, `queues/${qId}`)
      const res = await runTransaction(queueRef, (currentQueue: QueueType) => {
        if (currentQueue !== null) {
          if (!currentQueue.participants) {
            myQueues[qId] = 101
            currentQueue.participants = [101]
          } else {
            myQueues[qId] = (currentQueue.participants.at(-1) as number + 1)
            currentQueue.participants.push(myQueues[qId])
          }
          currentQueue.enterTimes[myQueues[qId]] = new Date().getTime()
        }
  
        localStorage.setItem("myQueues", JSON.stringify(myQueues))
        setBtnDisabled(false)
        return currentQueue
      })
      if (res.snapshot.val()) {
        setQueue(res.snapshot.val())
      } else {
        console.log("error")
      }
    }

  return (
    
  )
}