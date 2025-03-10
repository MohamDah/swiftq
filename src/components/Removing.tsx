import { DatabaseReference } from "firebase/database";
import { QueueType } from "../types";
import { useEffect, useState } from "react";

export default function Removing(props: { queueRef: DatabaseReference, setRemoving: React.Dispatch<React.SetStateAction<boolean>>, queue: QueueType }) {
  const { setRemoving } = props
  const [bgElCls, setBgElCls] = useState("bg-black/0")
  const [boxCls, setBoxCls] = useState("translate-y-96")

  useEffect(() => {
    document.body.style.overflow = "hidden"

    setBgElCls("bg-black/50")
    setBoxCls("translate-y-0")
    return () => {document.body.style.overflow = "auto"}
  }, [])

  async function handleUnmount() {
    setBgElCls("bg-black/0")
    setBoxCls("translate-y-96")

    setTimeout(() => setRemoving(false), 300)
    // await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <>
      <div onClick={handleUnmount} className={"absolute w-full h-full top-0 left-0 transition-all duration-300 " + bgElCls}></div>
      <div className={"w-3/4 h-96 bg-white absolute bottom-0 rounded-t-xl transition-all duration-300 " + boxCls}>

      </div>
    </>
  )
}