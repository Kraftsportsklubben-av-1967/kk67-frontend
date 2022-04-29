export const DEVELOPMENT = process.env.NODE_ENV === 'development'
export const HOSTNAME = window.location.hostname
export const PROXY_PORT = import.meta.env.VITE_PROXY_PORT

export const STYRKELOFT_URL = 'https://styrkeloft.no'
export const PROXY_URL = DEVELOPMENT ? `http://${HOSTNAME}:${PROXY_PORT}/proxy` : STYRKELOFT_URL

export const PREVIOUS_MEETS = `${PROXY_URL}/resultatservice_integrasjon/rss_protokoll.php?m=1&klubb_id=13`
export const UPCOMING_MEETS = `${PROXY_URL}/stevner/?page=ical&skipHeader=1&&k=13`
export const NEWS = `${PROXY_URL}/?format=feed&type=rss`
export const RECORDS = `${PROXY_URL}/resultatservice/?id=13&page=klubb_ranking&top=5&format=feed&type=rss`

export const FB_USER_TOKEN = import.meta.env.VITE_FB_USER_KEY
export const FB_PAGE_TOKEN = import.meta.env.VITE_FB_PAGE_KEY
export const INSTAGRAM_ID = '17841404742485905'
export const FB_PAGE_ID = '284710781586877'
export const FB_GRAPH_API = 'https://graph.facebook.com/v13.0'
