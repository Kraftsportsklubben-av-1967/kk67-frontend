// For documentation info visit, https://developers.google.com/maps/documentation/javascript/

import { Loader } from '@googlemaps/js-api-loader'
import GMaps = google.maps

const KK67_LOCATION: GMaps.LatLngLiteral = {
  lat: 63.437656,
  lng: 10.429489,
}

export async function initMap(dom: HTMLElement): Promise<void> {
  const google = await new Loader({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY }).load()
  const map: google.maps.Map = new google.maps.Map(dom, {
    center: KK67_LOCATION,
    zoom: 17,
  })

  const infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow({
    content: createInfoWindow('Kraftsportsklubben av 1967', [
      'Mellomveien 5',
      '7042 Trondheim',
      'Norge',
    ]),
  })

  const marker: google.maps.Marker = new google.maps.Marker({
    position: KK67_LOCATION,
    map: map,
    animation: google.maps.Animation.DROP,
    icon: '/public/kk-logo-mini.png',
  })
  marker.addListener('click', () => {
    marker.getAnimation()
      ? marker.setAnimation(null)
      : marker.setAnimation(google.maps.Animation.BOUNCE)

    infoWindow.open({
      anchor: marker,
      map,
      shouldFocus: false,
    })
  })
  infoWindow.addListener('closeclick', () => {
    marker.setAnimation(null)
  })
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
