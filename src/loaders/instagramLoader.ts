import { ICard, ICarusell } from './loadData'
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

interface IIGPost {
  media_type: string
  media_url: string
  timestamp: string
  permalink: string
  caption?: string | null
  id: string
  type: string
  children?: {
    data: ICarusell[]
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
      if (post.media_type)
        return {
          id: post.id,
          date: new Date(post.timestamp),
          src: post.media_url,
          url: post.permalink,
          text: post.caption ?? '',
          type: post.media_type,
          title: response.name,
          comp: post.caption?.substring(0, 10) || `instagram:${post.id}`,
          carusell: post.children ? post.children.data : [],
          profileUrl: response.profile_picture_url,
          href: 'https://www.instagram.com/kraftsportklubben_av_1967/',
        }
    }),
  )
}
