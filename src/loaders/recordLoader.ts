import { RECORDS, SESSION_RECORDS_KEY, STYRKELOFT_URL } from '../constants'
import { fetchDocument, DOMString } from './loadData'
import _ from 'lodash'

export interface IRecord {
  class?: string
  title?: string
  lifters: ILifter[]
}

interface ILifter {
  rank: string
  name: string
  date: string
  total: string
  href: string
}

async function getRecords(): Promise<IRecord[]> {
  const records = await fetchDocument(RECORDS, DOMString.TEXT_HTML)
  const container = records.getElementById('resultatservice_container')!

  const rows = Array.from(container.children).slice(4)
  return rows.map((row) => {
    if (row.localName === 'table') {
      const tds = Array.from(row.querySelectorAll('td'))
      const lifters = _.chunk(tds.slice(1), 4)
      return {
        class: tds[0].querySelector('h3')?.innerHTML,
        lifters: lifters.map((td) => {
          return {
            rank: td[0].innerText,
            name: td[1].innerText,
            href: updateHref(td[1].firstChild as HTMLAnchorElement),
            date: td[2].innerText,
            total: td[3].innerText,
          } as ILifter
        }),
      }
    }
    return {
      class: undefined,
      title: row.innerHTML,
      lifters: [],
    }
  })
}

export async function loadRecords(): Promise<IRecord[]> {
  if (window.sessionStorage.getItem(SESSION_RECORDS_KEY)) {
    return JSON.parse(window.sessionStorage.getItem(SESSION_RECORDS_KEY)!) as IRecord[]
  }
  const records = await getRecords()
  //window.sessionStorage.setItem(SESSION_RECORDS_KEY, JSON.stringify(records))
  return records
}

function updateHref(anchor: HTMLAnchorElement): string {
  const i = anchor.href.indexOf('/r')
  const uri = [anchor.href.slice(0, i), anchor.href.slice(i + 1)]

  return STYRKELOFT_URL + '/' + uri[1]
}
