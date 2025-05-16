import { Request, Response } from "express"

interface IUserController {
  signIp: (req: Request, res: Response) => Promise<void>
}

export default IUserController
