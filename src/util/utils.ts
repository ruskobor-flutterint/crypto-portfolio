import bunyan from "bunyan"

export type Logger = bunyan

export const loggerFactory = (name: string, options?: object): Logger => {
  return bunyan.createLogger({
    ...{
      name: name,
    },
    ...options,
  })
}

export const loggerFactoryV2 = ({
  name,
  options,
}: {
  name: string
  options?: object
}): Logger => {
  return bunyan.createLogger({
    ...{
      name: name,
    },
    ...options,
  })
}
