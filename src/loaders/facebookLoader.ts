import { BACKEND_URL } from '../constants'
import { removeUndefinedFromArray } from '../utils/removeUndefinedFromArray'
import { ICard, ICarusell, IMediaType } from './loadData'

interface IFBResponse {
  id: string
  name: string
  picture: {
    data: {
      height: number
      width: number
      url: string
    }
  }
  posts: {
    data: IFBPost[]
  }
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

function loadPosts(): Promise<IFBResponse> {
  return fetch(`${BACKEND_URL}/posts/fb/`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  }).then((res) => res.json())
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
  const response = await loadPosts()

  return removeUndefinedFromArray(
    response.posts.data.map((post: IFBPost) => {
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
        title: response.name,
        url: post.permalink_url,
        type: post.type,
        comp: post.message.substring(0, 10),
        profileUrl: response.picture.data.url,
        carusell,
        href: 'https://www.facebook.com/Kraftsportklubben1967',
      } as ICard
    }),
  )
}
