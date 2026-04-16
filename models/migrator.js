import database from 'infra/database'
import migrationsRunner from 'node-pg-migrate'
import { resolve } from 'node:path'

const defaultConfig = {
  databaseUrl: process.env.DATA_TEST,
  dir: resolve('infra', 'migrations'),
  dryRun: true,
  direction: 'up',
  verbose: true,
  migrationsTable: 'pgmigrations',
}

async function listPendingMigrations() {
  let dbClient
  try {
    dbClient = await database.getNewClient()

    const pendingMigrations = await migrationsRunner({
      ...defaultConfig,
      dbClient,
    })

    return pendingMigrations
  } finally {
    await dbClient?.end()
  }
}

async function runPendingMigrations() {
  let dbClient
  try {
    dbClient = await database.getNewClient()

    const migratedMigrations = await migrationsRunner({
      ...defaultConfig,
      dryRun: false,
      dbClient,
    })

    return migratedMigrations
  } finally {
    await dbClient?.end()
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
}

export default migrator
