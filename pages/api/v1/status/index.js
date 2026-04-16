import { createRouter } from 'next-connect'
import database from 'infra/database.js'
import { InternalServerError, MethodNotAllowedError } from 'infra/errors'

const router = createRouter()

router.get(getHandler)

export default router.handler({
  onError: onErrorHandler,
  onNoMatch: onNoMatchHandler,
})

function onErrorHandler(error, req, res) {
  const internalError = new InternalServerError({ cause: error })
  res.status(internalError.statusCode).json(internalError)
}

function onNoMatchHandler(req, res) {
  const publicError = new MethodNotAllowedError()
  res.status(publicError.statusCode).json(publicError)
}

async function getHandler(req, res) {
  const updatedAt = new Date().toISOString()
  const databaseVersionResult = await database.query('SHOW server_version;')
  const databaseVersionValue = databaseVersionResult.rows[0].server_version

  const databaseConnectionsResult = await database.query({
    text: 'SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;',
    values: [process.env.POSTGRES_DB],
  })
  const databaseConnectionsValue = databaseConnectionsResult.rows[0].count

  const databaseMaxConnectionsResult = await database.query(
    `SHOW max_connections;`,
  )
  const databaseMaxConnectionsValue = parseInt(
    databaseMaxConnectionsResult.rows[0].max_connections,
  )

  res.status(200).json({
    status: 'ok',
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseConnectionsValue,
      },
    },
  })
}
