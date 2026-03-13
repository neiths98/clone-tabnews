import { Client } from 'pg'

async function query(queryObject) {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: process.env.NODE_ENV === 'production'
  })

  console.log({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: process.env.NODE_ENV === 'production'
  })
  
  try {
    await client.connect()
    const result = await client.query(queryObject)
    return result
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    await client.end()
  }
}

export default {
  query,
}
