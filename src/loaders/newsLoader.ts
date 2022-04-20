import { fetchDocument, DOMString } from './loadData'
import { SESSION_NEWS_KEY } from '../constants/sess_keys'
import { NEWS } from '../constants'

export interface INews {
  title: string | null
  url?: string
}

async function getNews(): Promise<INews[]> {
  const news = await fetchDocument(NEWS, DOMString.TEXT_HTML)
  const container = news.getElementsByClassName('slide-entry-wrap')[0]
  const articles = Array.from(container.children)

  return articles
    .map((article) => article.getElementsByClassName('slide-entry-title entry-title')[0])
    .map((article) => {
      return {
        title: article.textContent,
        url: article.innerHTML.match(/href="([^"]*)/)![1],
      }
    })
}

export async function loadNews(): Promise<INews[]> {
  if (window.sessionStorage.getItem(SESSION_NEWS_KEY)) {
    return JSON.parse(window.sessionStorage.getItem(SESSION_NEWS_KEY)!) as INews[]
  }

  const news = await getNews()
  window.sessionStorage.setItem(SESSION_NEWS_KEY, JSON.stringify(news))
  return news
}
