import { loadFBPosts } from './facebookLoader'
import { loadIGPosts } from './instagramLoader'
import _ from 'lodash'

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
}

export async function loadPosts(): Promise<ICard[]> {
  if (window.sessionStorage.getItem('posts')) {
    return JSON.parse(window.sessionStorage.getItem('posts')!, (k, v) => {
      return k === 'date' ? new Date(v) : v
    }) as ICard[]
  }

  const igposts = await loadIGPosts()
  const fbposts = await loadFBPosts()

  const output = _.uniqBy([...igposts, ...fbposts], 'text')
  // TODO this is O(n²) complexity... would be better if we could ONLY query Facebook posts from the api to remove this duplicate removal funciton

  const result = output.sort((a: ICard, b: ICard) => b.date.getTime() - a.date.getTime())
  window.sessionStorage.setItem('posts', JSON.stringify(result))
  return result
}
