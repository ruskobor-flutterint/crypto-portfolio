import { Request, Response, NextFunction } from "express"
import Logger from "bunyan"

const logger = Logger.createLogger({ name: "HTTP" })

function httpLog(req: Request, res: Response, next: NextFunction): void {
  logger.info({
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: req.headers,
    ip: req.ip,
    time: new Date().toISOString(),
  })
  next()
}

export { httpLog }
