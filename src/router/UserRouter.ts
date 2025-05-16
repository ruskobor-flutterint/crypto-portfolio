import UserController from "@controllers/IUserController"
import BaseRouter from "./BaseRouter"
import { Router } from "express"

class UserRouter extends BaseRouter {
  private userController: UserController

  constructor() {
    super()
    const router = Router()

    router.get("/user", this.userController.signIp)

    this.addRouter(router)
  }

  public getRouter() {
    return this.router
  }
}

export default UserRouter
