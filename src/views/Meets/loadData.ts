import { removeUndefinedFromArray } from '../../utils/removeUndefinedFromArray'
import { UPCOMING_MEETS, PREVIOUS_MEETS, NEWS } from './constants'

export interface IMeet {
  title: string
  description?: string
  link: string
  date: Date
}
export enum MeetType {
  UPCOMING,
  PREVIOUS,
}
/**
 * Cache meet data into session storage. .
 */
export async function cacheMeets<T>(sessionKey: string, meetType: MeetType): Promise<T> {
  if (window.sessionStorage.getItem(sessionKey)) {
    switch (meetType) {
      case MeetType.PREVIOUS:
        return loadPreviousMeets(sessionKey) as T
      case MeetType.UPCOMING:
        return loadUpcommingMeets(sessionKey) as T
    }
  }

  let meets
  switch (meetType) {
    case MeetType.PREVIOUS:
      meets = await getPreviousMeets()
      break
    case MeetType.UPCOMING:
      meets = await getUpcommingMeets()
      break
  }
  window.sessionStorage.setItem(sessionKey, JSON.stringify(meets))
  return meets as unknown as T
}

function loadPreviousMeets(sessionKey: string) {
  return JSON.parse(window.sessionStorage.getItem(sessionKey)!, (key, value) => {
    return key === 'date' ? new Date(value) : value
  })
}

function loadUpcommingMeets(sessionKey: string) {
  return JSON.parse(window.sessionStorage.getItem(sessionKey)!, (key, value) => {
    return key === ('startDate' || 'endDate') ? new Date(value) : value
  })
}

enum DOMString {
  TEXT_HTML = 'text/html',
  TEXT_XML = 'text/xml',
  APP_XML = 'application/xml',
  APP_XHTML = 'application/xhtml+xml',
  IMAGE = 'image/svg+xml',
}

async function fetchDocument(endpoint: string, docType: DOMString): Promise<Document> {
  return fetch(endpoint, {
    method: 'GET',
  })
    .then((res) => res.text())
    .then((str) =>
      new window.DOMParser().parseFromString(str, docType as unknown as DOMParserSupportedType),
    )
}

export async function getNews(): Promise<undefined> {
  const news = await fetchDocument(NEWS, DOMString.TEXT_HTML)
  console.log(news)
  return undefined
}

export async function getPreviousMeets(): Promise<IMeet[]> {
  const meetData = await fetchDocument(PREVIOUS_MEETS, DOMString.APP_XML)

  const channel = meetData.querySelector('channel')
  if (!channel) {
    return []
  }
  const meets = Array.from(channel.children).filter((node) => node.nodeName === 'item')

  return removeUndefinedFromArray(
    meets.map((meet) => {
      const title = meet.querySelector('title')
      const date = meet.querySelector('pubDate')
      const description = meet.querySelector('description')
      const link = meet.querySelector('link')
      if (!title || !date || !description || !link) {
        return undefined
      }
      return {
        title: title.innerHTML,
        date: new Date(date.innerHTML),
        link: link.innerHTML,
        description: description.innerHTML,
      }
    }),
  )
}

async function fetchiCAL(endpoint: string): Promise<string> {
  return fetch(endpoint, {
    method: 'GET',
  }).then((res) => res.text())
}

export interface IUpcommingMeet {
  startDate: Date
  endDate: Date
  title: string
  weighIn: string
  url: string
}

export async function getUpcommingMeets() {
  return (await fetchiCAL(UPCOMING_MEETS))
    .split('BEGIN:VEVENT')
    .slice(1)
    .map((event: string) => {
      const [start, end, title, weighIn] = event
        .split(/\n/g)
        .slice(1, -2)
        .map((line) => line.split(/[A-Z][A-Z]*:/g)[1])

      return {
        startDate: icalToDate(start),
        endDate: icalToDate(end),
        title: title.replace(/\r/g, ''),
        weighIn,
        url: `https://styrkeloft.no/terminliste/?page=terminliste&aar=${new Date().getFullYear()}&mnd=&k%5B%5D=13`,
      } as IUpcommingMeet
    })
    .filter((event: IUpcommingMeet) => event.startDate >= new Date())
}

/**
 * convert ical format to date object
 * Typicall ical format "20211022T000000"
 * Year: 2021
 * Month: 10 / October
 * Day: 22
 *
 */
function icalToDate(ical: String): Date {
  const YEAR = Number(ical.substring(0, 4))
  const MONTH = Number(ical.substring(4, 6)) - 1 //Date starts at 0 = Jan and so on..
  const DAY = Number(ical.substring(6, 8))

  return new Date(YEAR, MONTH, DAY)
}
