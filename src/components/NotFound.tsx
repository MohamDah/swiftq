import { useNavigate } from "react-router-dom"

export default function NotFound({message} : {message: string}) {
  const navigate = useNavigate()

  return (
    <div className="-translate-y-1/2 mt-[50svh] w-full flex flex-col items-center">
      <h1 className="text-center text-3xl text-primary-purple font-bold">{message}</h1>
      <button className="rect text-primary-purple bg-secondary-purple mt-6"
      onClick={() => navigate("/")}>Go Home</button>
    </div>
  )
}