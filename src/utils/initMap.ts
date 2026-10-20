// For documentation info visit, https://developers.google.com/maps/documentation/javascript/

import GMaps = google.maps
import { GOOGLE_MAP_ID } from './googleMaps'

const KK67_LOCATION: GMaps.LatLngLiteral = {
  lat: 63.437656,
  lng: 10.429489,
}

export function initMap(
  dom: HTMLElement, maps: typeof google.maps, markerLibrary: google.maps.MarkerLibrary,
): () => void {
  const map = new maps.Map(dom, {
    center: KK67_LOCATION,
    zoom: 17,
    mapId: GOOGLE_MAP_ID,
  })

  const infoWindow = new maps.InfoWindow({
    content: createInfoWindow('Kraftsportsklubben av 1967', [
      'Mellomveien 5',
      '7042 Trondheim',
      'Norge',
    ]),
  })

  const image = document.createElement('img')
  image.src = '/public/kk-logo-mini.png'
  image.alt = ''
  const marker = new markerLibrary.AdvancedMarkerElement({
    position: KK67_LOCATION,
    title: 'Kraftsportsklubben av 1967',
    gmpClickable: true,
  })
  marker.append(image)
  marker.map = map

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let animation: Animation | undefined
  if (!reducedMotion.matches) {
    animation = image.animate(
      [{ transform: 'translateY(-24px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
      { duration: 500, easing: 'ease-out' },
    )
  }
  const onClick = () => {
    if (animation?.playState === 'running') {
      animation.cancel()
    } else if (!reducedMotion.matches) {
      animation = image.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(-12px)' }, { transform: 'translateY(0)' }],
        { duration: 700, iterations: Infinity, easing: 'ease-in-out' },
      )
    }

    infoWindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    })
  }
  marker.addEventListener('gmp-click', onClick)
  const closeListener = infoWindow.addListener('closeclick', () => {
    animation?.cancel()
  })
  const motionListener = () => { if (reducedMotion.matches) animation?.cancel() }
  reducedMotion.addEventListener('change', motionListener)
  return () => {
    marker.removeEventListener('gmp-click', onClick)
    closeListener.remove()
    reducedMotion.removeEventListener('change', motionListener)
    animation?.cancel()
    infoWindow.close()
    marker.map = null
    maps.event.clearInstanceListeners(map)
  }
}

function createInfoWindow(header: string, lines: string[]): string {
  return `
    <div id="content">
    <div id="siteNotice">
      <h1 class="text-md font-bold">${header}</h1>
      <div id="bodyContent">
      ${lines
        .map((line) => line + '<br />')
        .join()
        .replace(/,/g, '')}
      </div>
    </div>
    </div>`
}
