export const DEVELOPMENT = process.env.NODE_ENV === 'development'
export const HOSTNAME = window.location.hostname
export const PROXY_PORT = import.meta.env.VITE_PROXY_PORT

export const STYRKELOFT_URL = 'https://styrkeloft.no'
export const PROXY_URL = DEVELOPMENT ? `http://${HOSTNAME}:${PROXY_PORT}/proxy` : STYRKELOFT_URL

export const PREVIOUS_MEETS = `${PROXY_URL}/resultatservice_integrasjon/rss_protokoll.php?m=1&klubb_id=13`
export const UPCOMING_MEETS = `${PROXY_URL}/stevner/?page=ical&skipHeader=1&&k=13`
export const NEWS = `${PROXY_URL}/?format=feed&type=rss`

export const TOTALS = `${PROXY_URL}/resultatservice/?id=13&page=klubb_ranking&top=5&format=feed&type=rss`
export const SQUAT = `${PROXY_URL}/resultatservice/?id=13&page=klubb_ranking&top=5&ovelse=kb&format=feed&type=rss`
export const BENCH = `${PROXY_URL}/resultatservice/?id=13&page=klubb_ranking&top=5&ovelse=bp&format=feed&type=rss`
export const DEADLIFT = `${PROXY_URL}/resultatservice/?id=13&page=klubb_ranking&top=5&ovelse=ml&format=feed&type=rss`

export const BACKEND_URL = DEVELOPMENT ? 'http://localhost:5000' : 'https://www.kk-67.com/api'
