import { loggerFactory } from "@utils/utils"
import { Request, Response, NextFunction } from "express"

const logger = loggerFactory("http-log", {})
const authLogger = loggerFactory("auth", {})

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
    ip: req.ip,
    time: new Date().toISOString(),
  })
  next()
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Fake auth - just to give the notion of a auth middleware
  if (!req.header("X-Crypto-Portfolio-Token")) {
    authLogger.warn(
      `Request X-Crypto-Portfolio-Token header missing. ${JSON.stringify(
        req.headers
      )}`,
      req.headers
    )
    res
      .status(401)
      .send("Request header X-Crypto-Portfolio-Token missing.")
      .end()
  } else {
    next()
  }
}

function sanitizePortfolioMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postedPortfolio = req.body as {
      assets: { coin: string; amount: number }[]
    }

    const sanitizedPortfolio: {
      assets: { coin: string; amount: number }[]
      lastUpdated: string
    } = {
      assets: [],
      lastUpdated: new Date().toISOString(),
    }

    sanitizedPortfolio.assets = postedPortfolio.assets.map((asset) => {
      if (typeof asset.coin != "string") throw Error("Bad postPortfolio input")
      if (typeof asset.coin == "string" && asset.coin.length == 0)
        throw Error("Bad postPortfolio input")
      if (isNaN(asset.amount)) throw Error("Bad postPortfolio input")
      if (!isNaN(asset.amount) && asset.amount < 0)
        throw Error("Bad postPortfolio input")

      return { coin: asset.coin.toLocaleUpperCase(), amount: asset.amount }
    })

    req.body = sanitizedPortfolio
    next()
  } catch (error) {
    logger.error("Error sanitizing porfolio POST", error)
    res.status(400).send({ status: "bad input" }).end()
  }
}

function sanitizeUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postedUser = req.body as { user: string }
    const sanitizedUsername: { user: string } = {
      user: "",
    }

    if (typeof postedUser.user != "string") throw Error("Bad postUser input")
    if (typeof postedUser.user == "string" && postedUser.user.length == 0)
      throw Error("Bad postUser input")
    // Special symbols check
    const regex = /[^A-Za-z0-9]/
    if (regex.test(postedUser.user)) throw Error("Bad postUser input")

    sanitizedUsername.user = postedUser.user
    req.body = sanitizedUsername
    next()
  } catch (error) {
    logger.error("Error sanitizing user POST", error)
    res.status(400).send({ status: "bad input" }).end()
  }
}

export {
  httpLogMiddleware,
  authMiddleware,
  sanitizePortfolioMiddleware,
  sanitizeUserMiddleware,
}
