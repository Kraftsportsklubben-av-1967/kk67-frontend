import { removeUndefinedFromArrayAsync } from '../utils/removeUndefinedFromArrayAsync'
import { FB_PAGE_ID, FB_PAGE_TOKEN } from '../constants'
import { ICard } from './loadData'

interface IFBResponse {
  data: IFBResponseData[]
}

interface IFBResponseData {
  id: number
}

function loadPosts(): Promise<IFBResponse> {
  return new Promise((resolve) => {
    FB.api(
      `/${FB_PAGE_ID}/posts`,
      'GET',
      {
        transport: 'cors',
        access_token: FB_PAGE_TOKEN,
        fields: 'id',
      },
      (resp: IFBResponse) => resolve(resp),
    )
  })
}

interface IFBPost {
  permalink_url: string
  place: {
    name: string
    location: {
      latitude: number
      longitude: number
    }
    id: string
  }
  created_time: string
  message?: string
  full_picture: string
  id: string
  type: string
}

function getFBPost(id: string | number): Promise<IFBPost> {
  return new Promise((resolve) => {
    FB.api(
      `${id}`,
      'GET',
      {
        fields: 'place,via,message,permalink_url,created_time,full_picture',
        access_token: FB_PAGE_TOKEN,
      },
      (resp: IFBPost) => resolve(resp),
    )
  })
}

export async function loadFBPosts(): Promise<ICard[]> {
  const posts = await loadPosts()
  return removeUndefinedFromArrayAsync(
    posts.data.map(async (res: IFBResponseData) => {
      const post = await getFBPost(res.id)

      if (!post.message || post.message === '') {
        return undefined
      }

      return {
        date: new Date(post.created_time),
        id: post.id,
        src: post.full_picture,
        text: post.message,
        title: 'Facebook innlegg',
        url: post.permalink_url,
        type: post.type,
        comp: post.message.substring(0, 10),
      } as ICard
    }),
  )
}
