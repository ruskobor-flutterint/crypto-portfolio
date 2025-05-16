import express, { Router } from "express"
import { httpLog } from "@middlewares/Middleware"

class BaseRouter {
  protected router: Router
  constructor() {
    this.router = Router()
    this.router.use(express.json())
    this.router.use(httpLog)
  }

  public getRouter(): Router {
    return this.router
  }

  public addRouter(router: Router): void {
    this.router.use("/api/v1", router)
  }
}

export default BaseRouter
