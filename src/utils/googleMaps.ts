import { Loader } from '@googlemaps/js-api-loader'
import { readonly, ref } from 'vue'

export const GOOGLE_MAP_ID = '50951264950ac571f8b279ec'

declare global {
  interface Window {
    gm_authFailure?: () => void
  }
}

const authenticationError = ref('')
export const googleMapsError = readonly(authenticationError)
let loader: Loader | undefined

export function getGoogleMapsLoader(): Loader {
  const apiKey: string | undefined = import.meta.env.VITE_GOOGLE_API_KEY
  if (!apiKey?.trim()) {
    throw new Error('VITE_GOOGLE_API_KEY is missing. Configure it locally and restart Vite or rebuild.')
  }
  if (authenticationError.value) {
    throw new Error(authenticationError.value)
  }
  if (!loader) {
    const previousAuthFailure = window.gm_authFailure
    // The SDK can resolve its loader before reporting an authentication failure.
    window.gm_authFailure = () => {
      authenticationError.value = 'Google Maps avviste nettstedets API-tilgang. Kartet kunne ikke lastes.'
      previousAuthFailure?.()
    }
    loader = new Loader({ apiKey })
  }
  return loader
}
