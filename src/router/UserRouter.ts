import UserController from "@controllers/UserController"
import BaseRouter from "./BaseRouter"
import { Router } from "express"
import { getDIInstance } from "@utils/DI"
import { sanitizeUserMiddleware } from "@middlewares/Middleware"

class UserRouter extends BaseRouter {
  private userController: UserController

  constructor() {
    super()

    const router = Router()

    this.userController = getDIInstance<UserController>("userController")

    router.post(
      "/user",
      sanitizeUserMiddleware,
      this.userController.signUp.bind(this.userController)
    )

    this.addRouter(router)
  }

  public getRouter() {
    return this.router
  }
}

export default UserRouter
