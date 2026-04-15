import { createRouter } from 'next-connect'
import database from 'infra/database'
import migrationsRunner from 'node-pg-migrate'
import { resolve } from 'node:path'
import controller from 'infra/controller'

const router = createRouter()

router.get(getHandler)
router.post(postHandler)

export default router.handler(controller.errorHandlers)

const defaultConfig = {
  databaseUrl: process.env.DATA_TEST,
  dir: resolve('infra', 'migrations'),
  dryRun: true,
  direction: 'up',
  verbose: true,
  migrationsTable: 'pgmigrations',
}

async function getHandler(req, res) {
  let dbClient
  try {
    dbClient = await database.getNewClient()

    const pendingMigrations = await migrationsRunner({
      ...defaultConfig,
      dbClient,
    })

    return res.status(200).json(pendingMigrations)
  } finally {
    await dbClient.end()
  }
}

async function postHandler(req, res) {
  let dbClient
  try {
    dbClient = await database.getNewClient()

    const migratedMigrations = await migrationsRunner({
      ...defaultConfig,
      dryRun: false,
      dbClient,
    })

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations)
    }

    return res.status(200).json(migratedMigrations)
  } finally {
    await dbClient.end()
  }
}
