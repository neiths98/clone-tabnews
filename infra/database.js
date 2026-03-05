import { Client } from 'pg'

async function query(queryObject) {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  })
  console.log('\n\nclient\n', client)
  await client.connect()

  const result = await client.query(queryObject)
  await client.end()

  return result
}

export default {
  query,
}
