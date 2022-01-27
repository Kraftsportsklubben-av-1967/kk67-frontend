import { PRODUCTION, HOSTNAME, PROXY_PORT } from '../../constants/'

export const PROXY_URL = PRODUCTION
  ? 'https://styrkeloft.no/'
  : `http://${HOSTNAME}:${PROXY_PORT}/proxy`

export const PREVIOUS_MEETS = `${PROXY_URL}/resultatservice_integrasjon/rss_protokoll.php?m=1&klubb_id=13`
export const UPCOMING_MEETS = `${PROXY_URL}/stevner/?page=ical&skipHeader=1&&k=13`
