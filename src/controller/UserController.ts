import { Request, Response } from "express"

interface UserController {
  signIn: (req: Request, res: Response) => Promise<void>
}

export default UserController
