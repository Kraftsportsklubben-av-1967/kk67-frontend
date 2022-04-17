import { FB_TOKEN, INSTAGRAM_ID } from '../constants'

interface IFBResponse {
  data: Array<{
    id: number
  }>
}

// FB from facebook javascript SDK
async function loadMedia(): Promise<IFBResponse> {
  return new Promise((resolve, _reject) => {
    FB.api(
      `/${INSTAGRAM_ID}/media`,
      'GET',
      {
        transport: 'cors',
        access_token: FB_TOKEN,
      },
      function (response: IFBResponse) {
        resolve(response)
      },
    )
  })
}

export interface ICard {
  imgSrc: string
  title: string
  date: Date
  text: string
  url: string
}

async function mapIGPost(id: string | number): Promise<ICard> {
  return new Promise((resolve, _reject) => {
    FB.api(
      `${id}`,
      'GET',
      {
        fields: 'media_type, media_url, timestamp, permalink, caption',
        access_token: FB_TOKEN,
      },
      function (res) {
        resolve(res)
      },
    )
  })
}

export async function loadIGPosts(): Promise<ICard[]> {
  const media = await loadMedia()
  const result: ICard[] = []

  media.data.forEach(async (post) => result.push(await mapIGPost(post.id)))

  return result
}
