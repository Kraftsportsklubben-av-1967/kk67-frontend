import { removeUndefinedFromArrayAsync } from '../utils/removeUndefinedFromArrayAsync'
import { FB_USER_TOKEN, INSTAGRAM_ID } from '../constants'
import { ICard, IMediaType } from './loadData'
interface IIGResponse {
  data: IIGResponseData[]
}

interface IIGResponseData {
  id: number
}

function loadMedia(): Promise<IIGResponse> {
  return new Promise((resolve) => {
    FB.api(
      `/${INSTAGRAM_ID}/media`,
      'GET',
      {
        transport: 'cors',
        access_token: FB_USER_TOKEN,
      },
      (response: IIGResponse) => resolve(response),
    )
  })
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

function getIGPost(id: string | number): Promise<IIGPost> {
  return new Promise((resolve) => {
    FB.api(
      `${id}`,
      'GET',
      {
        fields:
          'media_type, media_url, timestamp, permalink, caption, children{media_type, media_url}',
        access_token: FB_USER_TOKEN,
      },
      (res: IIGPost) => resolve(res),
    )
  })
}

export async function loadIGPosts(): Promise<ICard[]> {
  const media = await loadMedia()
  return removeUndefinedFromArrayAsync(
    media.data.map(async (res) => {
      const post = await getIGPost(res.id)

      if (post.media_type)
        return {
          id: post.id,
          date: new Date(post.timestamp),
          src: post.media_url,
          url: post.permalink,
          text: post.caption,
          type: post.media_type,
          title: 'Instagram innlegg',
          comp: post.caption.substring(0, 10),
          carusell: post.children ? post.children.data : [],
        } as ICard
    }),
  )
}
