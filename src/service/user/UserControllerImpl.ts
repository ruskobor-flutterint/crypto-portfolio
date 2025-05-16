import IUserController from "@controllers/IUserController"
import { Request, Response } from "express"

class UserControllerImpl implements IUserController {
  async signIp(req: Request, res: Response): Promise<void> {
    // Implement the logic for signing in a user
  }
}

type UserService = new () => IUserController

export default UserControllerImpl as UserService