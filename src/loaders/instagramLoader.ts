import { ICard } from './loadData'
import { removeUndefinedFromArray } from '../utils/removeUndefinedFromArray'
import { BACKEND_URL_V2 } from '../constants'
interface IIGResponse extends IProfileData {
  id: string
  media: {
    data: IIGPost[]
  }
  name: string
  profile_picture_url: string
}

function loadMedia(): Promise<IIGResponse> {
  return fetch(`${BACKEND_URL_V2}/posts/ig/`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  }).then((res) => res.json())
}

interface IIGMedia {
  media_type: string
  media_url?: string
}

interface IIGPost extends IIGMedia {
  timestamp: string
  permalink: string
  caption?: string | null
  id: string
  children?: {
    data: IIGMedia[]
  }
}
interface IProfileData {
  profile_picture_url: string
  name: string
}

export async function loadIGPosts(): Promise<ICard[]> {
  const response = await loadMedia()
  return removeUndefinedFromArray(
    response.media.data.map((post): ICard | undefined => {
      if (!post.media_type) return undefined

      let src = post.media_type === 'IMAGE' ? post.media_url : undefined
      if (post.media_type === 'CAROUSEL_ALBUM') {
        src = post.children?.data.find((child) => child.media_type === 'IMAGE' && child.media_url)?.media_url
      }

      return {
        id: post.id,
        date: new Date(post.timestamp),
        ...(src ? { src } : {}),
        url: post.permalink,
        text: post.caption ?? '',
        title: response.name,
        profileUrl: response.profile_picture_url,
        href: 'https://www.instagram.com/kraftsportklubben_av_1967/',
      }
    }),
  )
}
