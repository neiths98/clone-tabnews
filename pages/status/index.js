import useSWR from 'swr'

async function fetchAPI(key) {
  const response = await fetch(key)
  const responseBody = await response.json()
  return responseBody
}

export default function StatusPage() {
  const { isLoading } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  })

  return (
    <>
      <h1>Página de Status! 😉</h1>
      <div>{isLoading ? 'Carregando...' : <StatusData />}</div>
    </>
  )
}

function StatusData() {
  const { data } = useSWR('/api/v1/status', fetchAPI, { refreshInterval: 2000 })

  const updatedAt = new Date(data.updated_at).toLocaleString('pt-BR')

  return (
    <div>
      <p>Status: {data.status}</p>
      <p>Atualizado em: {updatedAt}</p>
      <h2>Banco de dados</h2>
      <ul>
        <li>Versão: {data.dependencies.database.version}</li>
        <li>
          Conexões permitidas: {data.dependencies.database.max_connections}
        </li>
        <li>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </li>
      </ul>
    </div>
  )
}
