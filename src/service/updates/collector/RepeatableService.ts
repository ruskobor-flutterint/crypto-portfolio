class RepeatableService {
  private funcToCall: Function
  private interval: number
  private isRunning: boolean
  private intervalId: number | null

  constructor(funcToCall: Function, interval: number = 5000) {
    this.funcToCall = funcToCall
    this.interval = interval
    this.isRunning = false
    this.intervalId = null
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true
      this.intervalId = setInterval(this.funcToCall, this.interval)
      console.log("RS -> Started")
    } else {
      console.log("RS -> Already started")
    }
  }

  stop() {
    if (this.isRunning && this.intervalId) {
      clearInterval(this.interval)
      this.isRunning = false
      this.intervalId = null // review
      console.log(`RS -> Stopping`)
    } else {
      console.log("RS -> Not running")
    }
  }

  isRunningStatus(): boolean {
    return this.isRunning
  }
}

export default RepeatableService
