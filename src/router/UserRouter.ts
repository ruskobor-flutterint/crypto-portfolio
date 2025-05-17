import UserController from "@controllers/UserController"
import BaseRouter from "./BaseRouter"
import { Router } from "express"
import { getDIInstance } from "@utils/DI"

class UserRouter extends BaseRouter {
  private userController: UserController

  constructor() {
    super()
    const router = Router()
    this.userController = getDIInstance<UserController>("userController")

    router.get("/user", this.userController.signIn)

    this.addRouter(router)
  }

  public getRouter() {
    return this.router
  }
}

export default UserRouter
