import { onValue, ref, remove, runTransaction, set } from "firebase/database"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase"
import { useEffect, useState } from "react"
import { QueueType } from "../types"
import Loading from "../components/Loading"
import NotFound from "../components/NotFound"
import Removing from "../components/Removing"

export default function Admin() {
  const { qId, adminId } = useParams()
  const navigate = useNavigate()
  const [queue, setQueue] = useState(null as QueueType | null)
  const [showQR, setShowQR] = useState(false)
  const [confClose, setConfClose] = useState(false)
  const [errMessage, setErrMessage] = useState(false as false | string)
  const [removing, setRemoving] = useState(false)

  const queueRef = ref(db, `queues/${qId}`)



  useEffect(() => {
    // const queueRef = ref(db, `queues/${qId}`)
    const unsubscribe = onValue(queueRef, snapshot => {
      const queueData = snapshot.val()
      if (queueData === null && !errMessage) {
        setErrMessage("Queue not found")
        return
      }

      setQueue(queueData)
    })

    return () => unsubscribe()
  }, [])



  useEffect(() => {
    if (queue && adminId !== queue.adminId && !errMessage) {
      setErrMessage("Queue not found")
    }
  }, [queue, adminId, errMessage])

  if (errMessage) {
    return <NotFound message={errMessage} />
  }

  if (!queue) {
    return (
      <Loading />
    )
  }

  function inviteNext() {
    if (Array.isArray(queue?.participants)) {
      const nextNum = queue.participants[queue?.participants.indexOf(queue.currentPosition) + 1]
      queue.currentPosition = nextNum

      let timeSecs = new Date().getTime() - queue.enterTimes[queue.currentPosition]
      timeSecs = timeSecs / 1000
      queue.waitTimes.push(timeSecs)
      delete queue.enterTimes[queue.currentPosition]

      set(ref(db, `queues/${qId}`), queue)
    }
  }

  function closeQueue() {
    if (queue) {
      remove(ref(db, `queues/${qId}`))
      navigate("/")
    }
  }

  function toggleConf() {
    setConfClose(true)
    setTimeout(() => setConfClose(false), 3000)
  }

  async function addVisitor() {
    if (!queue) return
        const res = await runTransaction(queueRef, (currentQueue: QueueType) => {
          if (currentQueue !== null) {
            if (!currentQueue.participants) {
              currentQueue.participants = [101]
            } else {
              currentQueue.participants.push(currentQueue.participants.at(-1) as number + 1)
            }
            currentQueue.enterTimes[currentQueue.participants.at(-1) as number] = new Date().getTime()
          }
    
          return currentQueue
        })
        if (res.snapshot.val()) {
          setQueue(res.snapshot.val())
        } else {
          console.log("error")
        }
  }

  let custsLeft
  if (queue.participants) {
    let currInd = queue.participants && queue.participants.indexOf(queue.currentPosition)
    custsLeft = queue.participants ? queue.participants.slice(currInd === -1 ? 0 : currInd + 1).length : 0
  } else {
    custsLeft = 0
  }


  const ownUrl = new URL(window.location.href).origin
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${ownUrl}/${qId}&size=250x250`
  const qrComponent = (
    <>
      <div className="mt-10 p-2 border-2 border-primary-purple rounded-lg w-6/12 max-w-xs">
        <img className="w-full"
        src={qrUrl} alt="" />
      </div>
      <button className="rect mt-8 text-primary-purple"
        onClick={() => setShowQR(false)}>Go Back</button>
    </>
  )



  return (
    <>
      <img src={qrUrl} className="hidden"></img>
      <h2 className="mt-20 text-primary-purple font-bold w-10/12 max-w-md"><i className="fa-solid fa-location-dot"></i> {queue.queueName}</h2>
      <h2 className="text-primary-purple mt-2 text-center">There
        {
          custsLeft === 1
            ? <> is <span className="font-bold">{custsLeft} visitor</span> </>
            : <> are <span className="font-bold">{custsLeft} visitors</span> </>
        }
        waiting
      </h2>

      {
        showQR
          ? qrComponent
          :
          <>
            <h1 className="font-bold text-xl mt-6">Invited visitor number</h1>

            <div className="bg-secondary-purple text-primary-purple text-8xl font-bold py-4 w-9/12 max-w-64 text-center mt-10">
              {queue.currentPosition}
            </div>

            <button className={"rect bg-primary-purple text-white mt-12" + (custsLeft > 0 ? "" : " opacity-40")}
              onClick={inviteNext} disabled={!custsLeft}>
              {
                custsLeft > 0
                  ? "Invite next visitor"
                  : "Queue is empty"
              }
            </button>


            <button className="rect bg-primary-purple text-white mt-4"
              onClick={addVisitor}>Add visitor</button>


            <button className={"rect bg-red-100 text-red-500 border-red-500 mt-4 " + (custsLeft? "opacity-100" : "opacity-50")}
              onClick={() => setRemoving(true)}
              disabled={!custsLeft}>Remove visitor</button>
              {
                !confClose
                  ? <button className="rect text-primary-purple mt-4"
                    onClick={toggleConf}>Close Queue</button>
                  : <button className="rect text-white bg-red-500 mt-4 border-red-500"
                    onClick={closeQueue}>Are you sure?</button>
              }
            <button className="text-primary-purple font-semibold underline mt-4"
              onClick={() => setShowQR(true)}>Show QR code</button>
            
            {removing && <Removing queueRef={queueRef} setRemoving={setRemoving} queue={queue} />}
          </>
      }
    </>
  )

}