import database from 'infra/database'
import orchestrator from 'tests/orchestrator'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await database.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
})

test('POST to api/v1/migrations', async () => {
  // 1 Scenario - Run migrations for the first time
  const response = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST',
  })
  expect(response.status).toBe(201)

  const responseBody = await response.json()

  expect(Array.isArray(responseBody)).toBe(true)
  expect(responseBody.length).toBeGreaterThan(0)

  // 2 Scenario - Migrations have already been run
  const response2 = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST',
  })
  expect(response2.status).toBe(200)

  const responseBody2 = await response2.json()

  expect(Array.isArray(responseBody2)).toBe(true)
  expect(responseBody2.length).toBe(0)
})
