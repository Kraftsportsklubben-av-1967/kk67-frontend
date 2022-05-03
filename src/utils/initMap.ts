import { Loader } from '@googlemaps/js-api-loader'

// For documentation info visit, https://developers.google.com/maps/documentation/javascript/
export async function initMap(
  coordinates: { lat: number; lng: number },
  loader: Loader,
  dom: HTMLElement,
): Promise<void> {
  const google = await loader.load()
  const map: google.maps.Map = new google.maps.Map(dom, {
    center: coordinates,
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
    position: coordinates,
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
