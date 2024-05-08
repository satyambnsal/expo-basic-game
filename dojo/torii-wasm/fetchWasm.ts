export async function fetchWasm(uri: string) {
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      Accept: 'arrayBuffer',
      'Content-Type': 'arrayBuffer',
    },
  })

  return response.arrayBuffer()
}
