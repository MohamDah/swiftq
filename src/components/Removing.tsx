import { DatabaseReference, set } from "firebase/database";
import { QueueType } from "../types";
import { useEffect, useState } from "react";

export default function Removing(props: { queueRef: DatabaseReference, setRemoving: React.Dispatch<React.SetStateAction<boolean>>, queue: QueueType }) {
  const { queue, setRemoving, queueRef } = props
  const [bgElCls, setBgElCls] = useState("bg-black/0")
  const [boxCls, setBoxCls] = useState("translate-y-full")
  const [toRemove, setToRemove] = useState(new Set() as Set<number>)

  useEffect(() => {
    document.body.style.overflowY = "hidden"

    setBgElCls("bg-black/50")
    setBoxCls("translate-y-0")
    return () => { document.body.style.overflowY = "auto" }
  }, [])

  function handleUnmount() {
    setBgElCls("bg-black/0")
    setBoxCls("translate-y-full")

    setTimeout(() => setRemoving(false), 300)
  }

  function handleRemove() {
    const newQueue = {...queue}
    toRemove.forEach(i => {
      if (newQueue.participants){
        newQueue.participants.splice(newQueue.participants.indexOf(i), 1)
        delete newQueue.enterTimes[i]
      }
    })
    setToRemove(new Set() as Set<number>)
    set(queueRef, newQueue)
    handleUnmount()
    console.log(toRemove)
  }

  const visitorEls = queue.participants && queue.participants.slice(queue.currentPosition > 100 ? queue.participants.indexOf(queue.currentPosition) + 1 : 0).map(visitor => {
    // const handler = () => toRemove.current.has(visitor) ? toRemove.current.delete(visitor) : toRemove.current.add(visitor)
    const handler = () => setToRemove(prev => {
      const next = new Set(prev)
      next.has(visitor) ? next.delete(visitor): next.add(visitor)
      return next
    })
    const vCls = toRemove.has(visitor) ? "bg-red-200 text-red-600" : "bg-gray-300"
    return (
      <button className={"text-4xl font-bold py-2 rounded-3xl " + vCls}
        key={visitor}
        onClick={handler}>
        {visitor}
      </button>
    )
  })

  return (
    <>
      <div onClick={handleUnmount} className={"absolute w-full h-full top-0 left-0 transition-all duration-300 " + bgElCls}></div>

      <div className={"w-full max-w-3xl pt-3 bg-white fixed bottom-0 rounded-t-2xl transition-all duration-300 " + boxCls}>
        <div className="relative px-5 pb-2 border-b">
          <h3 className="text-start xs:text-center text-xl font-bold">Choose visitors</h3>
          <button className={"absolute top-0 right-5 text-primary-purple font-medium " + (!toRemove.size ? "opacity-50" : "")}
            disabled={!toRemove.size}
            onClick={handleRemove}>Remove</button>
        </div>

        <div className="mt-8 pb-16 grid grid-cols-2 xs:grid-cols-3 gap-x-2 sm:gap-x-7 gap-y-3 px-5 overflow-y-scroll max-h-[80svh]">
          {visitorEls}
        </div>
      </div>
    </>
  )
}