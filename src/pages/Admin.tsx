import { onValue, ref, remove, set } from "firebase/database"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase"
import { useEffect, useState } from "react"
import { QueueType } from "../types"

export default function Admin() {
  const { qId, adminId } = useParams()
  const navigate = useNavigate()
  const [queue, setQueue] = useState(null as QueueType | null)
  const [showQR, setShowQR] = useState(false)
  const [confClose, setConfClose] = useState(false)


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

  const ownUrl = new URL(window.location.href).origin
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${ownUrl}/${qId}&size=150x150`
  if (showQR) {

    return (
      <>
        <div className="mt-32 p-2 border-2 border-primary-purple rounded-lg">
          <img src={qrUrl} alt="" />
        </div>
        <button className="rect mt-8 text-primary-purple"
          onClick={() => setShowQR(false)}>Go Back</button>
      </>
    )
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


  return (
    <>
      <img src={qrUrl} className="hidden"></img>
      <h2 className="text-primary-purple mt-20">There
        {
          custsLeft === 1
            ? <> is <span className="font-bold">{custsLeft} visitor</span> </>
            : <> are <span className="font-bold">{custsLeft} visitors</span> </>
        }
        waiting
      </h2>

      <h1 className="font-bold text-xl mt-16">Invited visitor number</h1>

      <div className="bg-secondary-purple text-primary-purple text-8xl font-bold py-4 w-9/12 max-w-64 text-center mt-10">
        {queue.currentPosition}
      </div>

      <button className="rect bg-primary-purple text-white mt-12"
        onClick={inviteNext}>Invite next visitor</button>
      {
        !confClose
          ? <button className="rect text-primary-purple mt-6"
            onClick={toggleConf}>Close Queue</button>
          : <button className="rect text-white bg-red-500 mt-6 border-red-500"
            onClick={closeQueue}>Are you sure?</button>
      }
      <button className="text-primary-purple font-semibold underline mt-6"
        onClick={() => setShowQR(true)}>Show QR code</button>
    </>
  )

  return (
    <>
      <p>{custsLeft} in the queue</p>
      {/* <p>Current Number: {queue.currentPosition}</p> */}
      <button onClick={inviteNext}>Invite Next Guest</button>
    </>
  )
}