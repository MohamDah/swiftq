import { FallingLines } from "react-loader-spinner";

export default function Loading() {
  return (
    <div className="-translate-y-1/2 mt-[50svh]">
        <FallingLines
          color="#8C52FF"
          width="100"

          visible={true}
        />
      </div>
  )
}