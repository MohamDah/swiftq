

export function randStr() {
  let str = ""
  const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  for (let i = 0; i < 20; i++) {
    const randInd = Math.floor(Math.random() * charSet.length)
    str += charSet[randInd]
  }

  return str
}