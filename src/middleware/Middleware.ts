import { loggerFactory } from "@utils/utils"
import { Request, Response, NextFunction } from "express"

const logger = loggerFactory("http-log")
const authLogger = loggerFactory("auth")

function httpLogMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.info({
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    params: req.params,
    // headers: req.headers,
    ip: req.ip,
    time: new Date().toISOString(),
  })
  next()
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  authLogger.info(req.query.params)
  next()
}

export { httpLogMiddleware, authMiddleware }
