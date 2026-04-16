import { InternalServerError, MethodNotAllowedError } from 'infra/errors'

function onErrorHandler(error, req, res) {
  const internalError = new InternalServerError({ cause: error })
  res.status(internalError.statusCode).json(internalError)
}

function onNoMatchHandler(req, res) {
  const publicError = new MethodNotAllowedError()
  res.status(publicError.statusCode).json(publicError)
}

const controller = {
  errorHandlers: {
    onError: onErrorHandler,
    onNoMatch: onNoMatchHandler,
  },
}

export default controller
