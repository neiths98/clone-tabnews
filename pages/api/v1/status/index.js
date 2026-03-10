import database from 'infra/database.js'

async function status(req, res) {
  const updatedAt = new Date().toISOString()
  const databaseVersionResult = await database.query('SHOW server_version;')
  const databaseVersionValue = databaseVersionResult.rows[0].server_version

  const databaseConnectionsResult = await database.query({
    text: 'SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;',
    values: [process.env.POSTGRES_DB],
  })
  const databaseConnectionsValue = databaseConnectionsResult.rows[0].count

  const databaseMaxConnectionsResult = await database.query(`SHOW max_connections;`)
  const databaseMaxConnectionsValue = parseInt(databaseMaxConnectionsResult.rows[0].max_connections)


  res.status(200).json({
    status: 'ok',
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseConnectionsValue,
      }
    }
  })
}

export default status
