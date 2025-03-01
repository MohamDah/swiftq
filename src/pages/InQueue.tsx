import { useContext, useEffect, useState } from "react"
import { db } from "../firebase"
import { onValue, ref, runTransaction, set } from "firebase/database"
import { useNavigate, useParams } from "react-router-dom"
import { QueueType } from "../types"
import Loading from "../components/Loading"
import NotFound from "../components/NotFound"
import ColorContext from "../components/ColorContext"

export default function InQueue() {
  const [queue, setQueue] = useState(null as QueueType | null)
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [errMessage, setErrMessage] = useState(false as false | string)
  const [end, setEnd] = useState(false)
  // const [eta, setEta] = useState(0)
  const { qId } = useParams() as { qId: string }
  const navigate = useNavigate()

  if (!localStorage.getItem("myQueues")) localStorage.setItem("myQueues", '{}')
  const myQueues = (JSON.parse(localStorage.getItem("myQueues") || "{}"))

  const {color, setColor} = useContext(ColorContext)

  useEffect(() => {

    const unsubscribe = onValue(ref(db, `queues/${qId}`), snapshot => {
      const queueData: QueueType = snapshot.val()
      if (queueData === null) {
        delete myQueues[qId]
        localStorage.setItem("myQueues", JSON.stringify(myQueues))

        if (!errMessage) {
          if (queue) {
            setErrMessage("Queue was closed")
          } else {
            setErrMessage("Queue not found")
          }
        }
        return
      }

      if (!queue || (queue.participants && queueData.participants && queueData.participants.length !== queue.participants.length) || queueData.currentPosition !== queue.currentPosition) {
        setQueue(queueData)
      }

      if (queueData.currentPosition > myQueues[qId] && !errMessage) {
        setEnd(true)
      }
    })

    return () => unsubscribe()

  }, [])

  async function insertToQ() {
    if (!queue) return

    setBtnDisabled(true)

    const queueRef = ref(db, `queues/${qId}`)
    await runTransaction(queueRef, (currentQueue: QueueType) => {
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

      setQueue(currentQueue)
      return currentQueue
    })
  }


  async function quitQueue() {
    if (myQueues[qId] && queue?.participants) {
      const newQueue = { ...queue }
      // remove from line
      newQueue.participants = queue.participants.filter(i => i !== myQueues[qId])
      if (newQueue.participants.length === 0) {
        newQueue.participants = false
      }
      // remove time entry
      delete newQueue.enterTimes[myQueues[qId]]
      setQueue(newQueue)
      myQueues[qId] !== queue.currentPosition && set(ref(db, `queues/${qId}`), newQueue)
      delete myQueues[qId]
      localStorage.setItem("myQueues", JSON.stringify(myQueues))
      navigate("/")
    }
  }


  if (errMessage) return <NotFound message={errMessage} />

  if (!queue) return <Loading />

  let myPosition = 0
  if (Array.isArray(queue.participants)) {
    if (queue.currentPosition > 100) {
      const startInd = queue.participants.indexOf(queue.currentPosition)
      const endInd = queue.participants.indexOf(myQueues[qId])
      myPosition = queue.participants.slice(startInd, endInd).length
    } else {
      myPosition = queue.participants.indexOf(myQueues[qId]) + 1
    }
  }


  if (myQueues[qId] === queue.currentPosition && color !== "green"){
    setColor("green")
  }


  const frmtMyPosition = myPosition.toString().at(-1) === "1" ? myPosition + "st" : myPosition.toString().at(-1) === "2" ? myPosition + "nd" : myPosition.toString().at(-1) === "3" ? myPosition + "rd" : myPosition + "th"

  // Get eta
  let eta = Math.round((queue.waitTimes.reduce((a, i) => a + i, 0) / queue.waitTimes.length - 1) * 10) / 10
  eta = eta !== -1 ? eta * myPosition : eta
  let etaMessage = eta < 60 ? `${eta} seconds` : `${(eta / 60).toFixed(1)} minutes`


  if (!myQueues[qId]) {
    return (
      <>
        <p className="mt-36 text-primary-purple font-bold text-center w-11/12">You are about to join queue: "{queue.queueName}"</p>
        <button className="rect mt-6"
          onClick={insertToQ} disabled={btnDisabled}>Join</button>
      </>
    )
  }

  const blobCls = myPosition > 0 ? "blob" : !end ? "blob-green" : ""
  return (
    <>
      <p className={"mt-20 w-10/12 max-w-md font-bold " + (myPosition > 0 ? "text-primary-purple" : "text-primary-green") + (end ? " invisible" : "")}>
        <i className="fa-solid fa-location-dot"></i> {queue.queueName}
      </p>

      <div className={`${blobCls} relative bg-white w-10/12 max-w-sm aspect-square border-[18px] xs:border-[24px] rounded-full transition-all duration-500 ${myPosition > 0 ? "border-primary-purple" : !end ? "border-primary-green" : "duration-1000 border-transparent bg-transparent"}`}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 xs:gap-5 text-center py-8">
          {
            end
              ? <h1 className="text-3xl xs:text-4xl font-bold text-center">Thanks for visiting!</h1>
              : <>
                <p className="text-sm xs:text-base">Your number is #{myQueues[qId]}</p>
                <h1 className="text-3xl xs:text-4xl font-bold text-center">
                  {
                    myPosition > 0
                      ? `You are ${frmtMyPosition} in the queue`
                      : `It's your turn now!`
                  }
                </h1>
                <p className="text-sm xs:text-base">
                  {
                    eta > 0
                      ? `ETA: ${etaMessage}`
                      : eta === -1
                        ? `Queue will start soon`
                        : `At long last!`
                  }
                </p>
              </>
          }
        </div>
      </div>
      {/* { (myPosition > 0 || end) && */}
      <button className={`rect text-white mt-10 ${myPosition > 0 ? "bg-primary-purple" : "bg-primary-green border-primary-green"}`}
        onClick={quitQueue}>
        {!end
          ? "Quit Queue"
          : "Go Home"}
      </button>
      {/* } */}
    </>
  )
}