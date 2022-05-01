import { removeUndefinedFromArrayAsync } from '../utils/removeUndefinedFromArrayAsync'
import { FB_PAGE_ID, FB_PAGE_TOKEN } from '../constants'
import { ICard, ICarusell, IMediaType } from './loadData'

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
  attachments?: IFBPostAttachments
}

interface IFBPostAttachments {
  data: Array<{
    type: string
    subattachments?: IFBPostSubAttachments
  }>
}

interface IFBPostSubAttachments {
  data: Array<{
    media: {
      image?: {
        height: number
        width: number
        src: string
      }
      video?: {
        height: number
        width: number
        src: string
      }
    }
    type: string
  }>
}

function getFBPost(id: string | number): Promise<IFBPost> {
  return new Promise((resolve) => {
    FB.api(
      `${id}`,
      'GET',
      {
        fields: 'place,message,permalink_url,created_time,full_picture,attachments',
        access_token: FB_PAGE_TOKEN,
      },
      (resp: IFBPost) => resolve(resp),
    )
  })
}

function loadChildPosts(req?: IFBPostSubAttachments): ICarusell[] {
  if (!req) return []
  return req.data.map((subattach) => {
    let type: IMediaType
    let src: string
    if (subattach.type === 'photo' && subattach.media.image) {
      type = IMediaType.IMAGE
      src = subattach.media.image.src
    } else {
      type = IMediaType.VIDEO
      src = subattach.media.video!.src
    }

    return {
      media_url: src,
      media_type: type,
    }
  })
}

export async function loadFBPosts(): Promise<ICard[]> {
  const posts = await loadPosts()

  return removeUndefinedFromArrayAsync(
    posts.data.map(async (res: IFBResponseData) => {
      const post = await getFBPost(res.id)
      let carusell: ICarusell[] = []
      if (!post.message || post.message === '') {
        return undefined
      }

      if (post.attachments && post.attachments.data[0].type === 'share') {
        return undefined
      }

      if (post.attachments && post.attachments.data[0].type === 'album') {
        carusell = loadChildPosts(post.attachments.data[0].subattachments)
      }

      switch (post.attachments?.data[0].type) {
        case 'album':
          post.type = 'CAROUSEL_ALBUM'
          break
        case 'photo':
          post.type = 'IMAGE'
          break
        case 'video':
          post.type = 'VIDEO'
          break
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
        carusell,
      } as ICard
    }),
  )
}
