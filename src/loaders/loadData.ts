import { loadFBPosts } from './facebookLoader'
import { loadIGPosts } from './instagramLoader'
import _ from 'lodash'
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
  type?: string
  comp?: string
}

export async function loadPosts(): Promise<ICard[]> {
  if (window.sessionStorage.getItem(SESSION_POSTS_KEY)) {
    return JSON.parse(window.sessionStorage.getItem(SESSION_POSTS_KEY)!, (k, v) => {
      return k === 'date' ? new Date(v) : v
    }) as ICard[]
  }

  const igposts = await loadIGPosts()
  const fbposts = await loadFBPosts()

  const output = _.uniqBy([...igposts, ...fbposts], 'comp')
  // TODO this is O(n²) complexity... would be better if we could ONLY query Facebook posts from the api to remove this duplicate removal funciton

  const result = output.sort((a: ICard, b: ICard) => b.date.getTime() - a.date.getTime())
  window.sessionStorage.setItem(SESSION_POSTS_KEY, JSON.stringify(result))
  return result
}
