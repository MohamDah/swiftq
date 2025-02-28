export type QueueType = {
  adminId: string,
  currentPosition: number,
  participants: number[] | false,
  queueName: string,
  waitTimes: number[],
  enterTimes: {[key: string]: number}
}