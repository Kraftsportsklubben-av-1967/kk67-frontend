import { ICard } from './loadData'
import { removeUndefinedFromArray } from '../utils/removeUndefinedFromArray'
import { BACKEND_URL } from '../constants'
interface IIGResponse {
  id: string
  media: {
    data: IIGPost[]
  }
  name: string
  profile_picture_url: string
}

function loadMedia(): Promise<IIGResponse> {
  return fetch(`${BACKEND_URL}/posts/ig`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  }).then((res) => res.json())
}

interface IIGPost {
  media_type: string
  media_url: string
  timestamp: string
  permalink: string
  caption: string
  id: string
  type: string
  children: {
    data: Array<{
      media_type: string
      media_url: string
    }>
  }
}
interface IProfileData {
  profile_picture_url: string
  name: string
}

export async function loadIGPosts(): Promise<ICard[]> {
  const response = await loadMedia()
  return removeUndefinedFromArray(
    response.media.data.map((post) => {
      if (post.media_type)
        return {
          id: post.id,
          date: new Date(post.timestamp),
          src: post.media_url,
          url: post.permalink,
          text: post.caption,
          type: post.media_type,
          title: response.name,
          comp: post.caption.substring(0, 10),
          carusell: post.children ? post.children.data : [],
          profileUrl: response.profile_picture_url,
          href: 'https://www.instagram.com/kraftsportklubben_av_1967/',
        } as ICard
    }),
  )
}
