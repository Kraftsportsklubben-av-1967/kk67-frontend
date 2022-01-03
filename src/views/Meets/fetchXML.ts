export async function fetchXML(endpoint: string): Promise<Document> {
  return fetch(`http://localhost:8010/proxy/${endpoint}`, {
    method: 'GET',
  })
    .then((res) => res.text())
    .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
}
