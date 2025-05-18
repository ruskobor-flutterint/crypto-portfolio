import { Request, Response } from "express"

interface UserController {
  signUp: (req: Request, res: Response) => Promise<void>
}

export default UserController
