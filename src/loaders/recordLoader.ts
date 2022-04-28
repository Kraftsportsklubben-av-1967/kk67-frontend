import { RECORDS, SESSION_RECORDS_KEY, STYRKELOFT_URL } from '../constants'
import { fetchDocument, DOMString } from './loadData'

export interface IRecord {
  class?: string
  rank?: string
  name?: string
  href?: string
  date?: string
  total?: string
  title?: string
}

async function getRecords(): Promise<IRecord[]> {
  const records = await fetchDocument(RECORDS, DOMString.TEXT_HTML)
  const container = records.getElementById('resultatservice_container')!

  const rows = Array.from(container.children).slice(4)
  console.log(rows)
  return rows.map((row) => {
    if (row.localName === 'table') {
      const tds = row.querySelectorAll('td')
      console.log(tds)
      return {
        class: tds[0].querySelector('h3')?.innerHTML,
        rank: tds[1].innerText,
        name: tds[2].innerText,
        href: updateHref(tds[2].firstChild as HTMLAnchorElement),
        date: tds[3].innerText,
        total: tds[4].innerText,
      } as IRecord
    }
    return {
      title: row.innerHTML,
    } as IRecord
  })
}

export async function loadRecords(): Promise<IRecord[]> {
  if (window.sessionStorage.getItem(SESSION_RECORDS_KEY)) {
    return JSON.parse(window.sessionStorage.getItem(SESSION_RECORDS_KEY)!) as IRecord[]
  }
  const records = await getRecords()
  window.sessionStorage.setItem(SESSION_RECORDS_KEY, JSON.stringify(records))
  return records
}

function updateHref(anchor: HTMLAnchorElement): string {
  const i = anchor.href.indexOf('/r')
  const uri = [anchor.href.slice(0, i), anchor.href.slice(i + 1)]
  console.log(uri)

  return STYRKELOFT_URL + uri[1]
}
