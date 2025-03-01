import { createContext, ReactElement, useState } from "react";

const ColorContext = createContext({} as {color: string, setColor: React.Dispatch<React.SetStateAction<string>>})

export function ColorProvider({children} : {children: ReactElement}) {
  const [color, setColor] = useState("purple")

  return (
    <ColorContext.Provider value={{color, setColor}}>
      {children}
    </ColorContext.Provider>
  )
}

export default ColorContext