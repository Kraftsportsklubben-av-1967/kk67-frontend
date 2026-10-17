import { loadIGPosts } from './instagramLoader'
import { SESSION_POSTS_KEY } from '../constants'

export enum DOMString {
  TEXT_HTML = 'text/html',
  TEXT_XML = 'text/xml',
  APP_XML = 'application/xml',
  APP_XHTML = 'application/xhtml+xml',
  IMAGE = 'image/svg+xml',
}

export async function fetchDocument(endpoint: string, docType: DOMString): Promise<Document> {
  return fetch(endpoint, {
    method: 'GET',
    mode: 'cors',
  })
    .then((res) => res.text())
    .then((str) =>
      new window.DOMParser().parseFromString(str, docType as unknown as DOMParserSupportedType),
    )
}

export interface ICard {
  id: string
  src?: string
  title: string
  date: Date
  text: string
  url: string
  profileUrl: string
  href: string
}

export async function loadPosts(): Promise<ICard[]> {
  if (window.sessionStorage.getItem(SESSION_POSTS_KEY)) {
    return JSON.parse(window.sessionStorage.getItem(SESSION_POSTS_KEY)!, (k, v) => {
      return k === 'date' ? new Date(v) : v
    }) as ICard[]
  }

  const posts = await loadIGPosts()
  posts.sort((a, b) => b.date.getTime() - a.date.getTime())
  window.sessionStorage.setItem(SESSION_POSTS_KEY, JSON.stringify(posts))
  return posts
}
