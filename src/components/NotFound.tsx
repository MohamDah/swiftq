import { useNavigate } from "react-router-dom"

export default function NotFound({message} : {message: string}) {
  const navigate = useNavigate()

  return (
    <div className="-translate-y-1/2 mt-[50svh] w-full flex flex-col items-center text-center text-primary-purple font-bold">
      <button className="text-white bg-primary-purple rounded-full h-10 w-10 mt-6"
      onClick={() => navigate("/")}><i className="fa-solid fa-x"></i></button>
      <h1 className="text-8xl mt-8">Oops!</h1>
      <h2 className="text-3xl mt-5">{message}</h2>
    </div>
  )
}