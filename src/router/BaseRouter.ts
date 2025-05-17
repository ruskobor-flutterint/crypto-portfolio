import express, { Router } from "express"
import { httpLogMiddleware } from "@middlewares/Middleware"

class BaseRouter {
  protected router: Router
  constructor() {
    this.router = Router()
    this.router.use(httpLogMiddleware)
    this.router.use(express.json())
  }

  public getRouter(): Router {
    return this.router
  }

  public addRouter(router: Router): void {
    this.router.use("/api/v1", router)
  }
}

export default BaseRouter
