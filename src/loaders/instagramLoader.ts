import { ICard, ICardMedia } from './loadData'
import { removeUndefinedFromArray } from '../utils/removeUndefinedFromArray'
import { isRecord } from '../utils/isRecord'
import { BACKEND_URL_V2 } from '../constants'

async function loadMedia(): Promise<unknown> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)
  try {
    const response = await fetch(`${BACKEND_URL_V2}/posts/ig/`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`Instagram request failed (${response.status})`)
    return await response.json()
  } finally {
    clearTimeout(timeout)
  }
}

function toCardMedia(value: unknown): ICardMedia | undefined {
  if (!isRecord(value)) throw new Error('Invalid Instagram media')
  if (value.media_type !== 'IMAGE' && value.media_type !== 'VIDEO') return undefined
  if (value.media_url == null || value.media_url === '') return undefined
  if (typeof value.media_url !== 'string') {
    throw new Error('Invalid Instagram media URL')
  }
  return { type: value.media_type, src: value.media_url }
}

export async function loadIGPosts(): Promise<ICard[]> {
  const response = await loadMedia()
  if (
    !isRecord(response) || typeof response.name !== 'string'
    || typeof response.profile_picture_url !== 'string'
    || !isRecord(response.media) || !Array.isArray(response.media.data)
  ) {
    throw new Error('Invalid Instagram feed response')
  }
  const posts: unknown[] = response.media.data
  const { name, profile_picture_url } = response
  return removeUndefinedFromArray(
    posts.map((post): ICard | undefined => {
      if (!isRecord(post)) throw new Error('Invalid Instagram post')
      if (!post.media_type) return undefined
      if (
        typeof post.id !== 'string' || typeof post.timestamp !== 'string'
        || typeof post.permalink !== 'string'
        || (post.caption != null && typeof post.caption !== 'string')
      ) {
        throw new Error('Invalid Instagram post data')
      }
      const date = new Date(post.timestamp)
      if (!Number.isFinite(date.getTime())) throw new Error('Invalid Instagram post date')

      let media: unknown[] = [post]
      if (post.media_type === 'CAROUSEL_ALBUM') {
        if (post.children == null) media = []
        else if (isRecord(post.children) && Array.isArray(post.children.data)) media = post.children.data
        else throw new Error('Invalid Instagram album')
      }
      return {
        id: post.id,
        date,
        media: removeUndefinedFromArray(media.map(toCardMedia)),
        url: post.permalink,
        text: post.caption ?? '',
        title: name,
        profileUrl: profile_picture_url,
        href: 'https://www.instagram.com/kraftsportklubben_av_1967/',
      }
    }),
  )
}
