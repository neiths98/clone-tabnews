import { Client } from 'pg'
import { ServiceError } from './errors'

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    }
  }

  return process.env.NODE_ENV === 'production'
}

async function getNewClient() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: getSSLValues(),
  })

  await client.connect()
  return client
}

async function query(queryObject) {
  let client
  try {
    client = await getNewClient()
    const result = await client.query(queryObject)
    return result
  } catch (error) {
    throw new ServiceError({
      message: 'Erro na conexão com o banco ou na query',
      cause: error,
    })
  } finally {
    await client?.end()
  }
}

const database = {
  query,
  getNewClient,
}

export default database
