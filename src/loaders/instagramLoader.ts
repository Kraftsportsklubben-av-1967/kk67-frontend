import { FB_TOKEN, INSTAGRAM_ID } from '../constants'

interface IFBResponse {
  data: Array<{
    id: number
  }>
}

// FB from facebook javascript SDK
function loadMedia(): Promise<IFBResponse> {
  return new Promise((resolve) => {
    FB.api(
      `/${INSTAGRAM_ID}/media`,
      'GET',
      {
        transport: 'cors',
        access_token: FB_TOKEN,
      },
      (response: IFBResponse) => resolve(response),
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
}

function mapIGPost(id: string | number): Promise<IIGPost> {
  return new Promise((resolve) => {
    FB.api(
      `${id}`,
      'GET',
      {
        fields: 'media_type, media_url, timestamp, permalink, caption',
        access_token: FB_TOKEN,
      },
      (res: IIGPost) => resolve(res),
    )
  })
}

export interface ICard {
  src: string
  title: string
  date: Date
  text: string
  url: string
}

export async function loadIGPosts(): Promise<ICard[]> {
  if (window.sessionStorage.getItem('ig-posts')) {
    return JSON.parse(window.sessionStorage.getItem('ig-posts')!, (key, value) => {
      return key === 'date' ? new Date(value) : value
    }) as ICard[]
  }

  const media = await loadMedia()
  const result = Promise.all(
    media.data.map(async (res) => {
      const post = await mapIGPost(res.id)
      return {
        date: new Date(post.timestamp),
        src: post.media_url,
        url: post.permalink,
        text: post.caption,
        type: post.media_type,
        title: '@Kraftsporstklubben_av_1967',
      } as ICard
    }),
  )

  window.sessionStorage.setItem('ig-posts', JSON.stringify(await result))
  return result
}
