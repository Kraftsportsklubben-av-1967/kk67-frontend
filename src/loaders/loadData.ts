import { loadIGPosts } from './instagramLoader'
import { SESSION_POSTS_KEY } from '../constants'
import { isRecord } from '../utils/isRecord'

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
  media: ICardMedia[]
  title: string
  date: Date
  text: string
  url: string
  profileUrl: string
  href: string
}

export interface ICardMedia {
  type: 'IMAGE' | 'VIDEO'
  src: string
}

function isCard(value: unknown): value is ICard {
  return (
    isRecord(value)
    && ['id', 'title', 'text', 'url', 'profileUrl', 'href'].every(key => typeof value[key] === 'string')
    && value.date instanceof Date && Number.isFinite(value.date.getTime())
    && Array.isArray(value.media) && value.media.every(item =>
      isRecord(item) && (item.type === 'IMAGE' || item.type === 'VIDEO')
      && typeof item.src === 'string' && item.src.length > 0)
  )
}

function isStorageError(error: unknown): error is DOMException {
  return error instanceof DOMException && ['SecurityError', 'QuotaExceededError'].includes(error.name)
}

export async function loadPosts(): Promise<ICard[]> {
  try {
    const saved = window.sessionStorage.getItem(SESSION_POSTS_KEY)
    if (saved !== null) {
      const cached: unknown = JSON.parse(saved, (key, value) =>
        key === 'date' && typeof value === 'string' ? new Date(value) : value)
      if (Array.isArray(cached) && cached.length > 0 && cached.every(isCard)) return cached
      console.warn('Ignoring invalid or empty Instagram feed cache')
    }
  } catch (error) {
    if (!(error instanceof SyntaxError) && !isStorageError(error)) throw error
    console.warn('Could not read Instagram feed cache', error.name)
  }

  const posts = await loadIGPosts()
  posts.sort((a, b) => b.date.getTime() - a.date.getTime())
  if (posts.length > 0) {
    try {
      window.sessionStorage.setItem(SESSION_POSTS_KEY, JSON.stringify(posts))
    } catch (error) {
      if (!isStorageError(error)) throw error
      console.warn('Could not save Instagram feed cache', error.name)
    }
  }
  return posts
}
