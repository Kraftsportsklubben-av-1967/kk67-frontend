<template>
  <div class="route-map">
    <fieldset class="travel-modes">
      <legend>Velg reisemåte</legend>
      <label>
        <input v-model="travelMode" type="radio" :name="modeGroup" value="WALKING" :disabled="loading" />
        Til fots
      </label>
      <label>
        <input v-model="travelMode" type="radio" :name="modeGroup" value="DRIVING" :disabled="loading" />
        Med bil
      </label>
    </fieldset>
    <div class="map-frame" :aria-busy="loading">
      <div v-show="!mapError" ref="mapDiv" class="map-canvas" />
      <p v-if="mapError" role="alert" class="map-message">{{ mapError }}</p>
      <p v-else-if="loading" role="status" class="map-message">Laster veibeskrivelse …</p>
    </div>
    <p v-if="travelMode === 'WALKING'" class="route-warning walking-notice">
      Gangruter er i betaversjon og kan mangle tydelige fortau eller gangveier. Vær forsiktig.
    </p>
    <p v-for="warning in warnings" :key="warning" class="route-warning">{{ warning }}</p>
    <a :href="directionsUrl" target="_blank" rel="noopener noreferrer" class="directions-link">
      Åpne ruten i Google Maps <span aria-hidden="true">↗</span>
    </a>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { getGoogleMapsLoader, googleMapsError, GOOGLE_MAP_ID } from '../../utils/googleMaps'

interface RouteMarker {
  marker: google.maps.marker.AdvancedMarkerElement
  onClick: () => void
}

export default defineComponent({
  props: {
    origin: { type: String, required: true },
    destination: { type: String, required: true },
  },
  setup(props) {
    const mapDiv = ref<HTMLElement>()
    const modeGroup = useId()
    const travelMode = ref<'WALKING' | 'DRIVING'>('WALKING')
    const loading = ref(true)
    const error = ref('')
    const warnings = ref<string[]>([])
    const mapError = computed(() => googleMapsError.value || error.value)
    const directionsUrl = computed(() => {
      const query = new URLSearchParams({
        api: '1', origin: props.origin, destination: props.destination,
        travelmode: travelMode.value.toLowerCase(),
      })
      return `https://www.google.com/maps/dir/?${query}`
    })
    let map: google.maps.Map | undefined
    let polylines: google.maps.Polyline[] = []
    let markers: RouteMarker[] = []
    let routeInfoWindow: google.maps.InfoWindow | undefined
    let requestId = 0
    let disposed = false

    function clearRoute() {
      routeInfoWindow?.close()
      routeInfoWindow = undefined
      polylines.forEach(line => line.setMap(null))
      markers.forEach(({ marker, onClick }) => {
        marker.removeEventListener('gmp-click', onClick)
        marker.map = null
      })
      polylines = []
      markers = []
      warnings.value = []
    }

    async function updateRoute() {
      if (!map || disposed || googleMapsError.value) return
      const currentMap = map
      const currentRequest = ++requestId
      const request = {
        origin: props.origin,
        destination: props.destination,
        travelMode: travelMode.value,
        fields: ['path', 'viewport', 'warnings'],
      } satisfies google.maps.routes.ComputeRoutesRequest
      loading.value = true
      error.value = ''
      clearRoute()
      try {
        const loader = getGoogleMapsLoader()
        const [{ Route }, { AdvancedMarkerElement, PinElement }] = await Promise.all([
          loader.importLibrary('routes'), loader.importLibrary('marker'),
        ])
        if (disposed || currentRequest !== requestId) return
        const { routes } = await Route.computeRoutes(request)
        if (disposed || currentRequest !== requestId) return
        const route = routes?.[0]
        if (!route?.path || route.path.length < 2 || !route.viewport) {
          throw new Error('Google Maps returned no usable route')
        }
        polylines = route.createPolylines()
        if (polylines.length === 0) {
          throw new Error('Google Maps returned no route geometry')
        }
        polylines.forEach(line => line.setMap(currentMap))
        const infoWindow = new google.maps.InfoWindow()
        routeInfoWindow = infoWindow
        const endpoints = [
          { point: route.path[0], label: 'A', title: request.origin },
          { point: route.path[route.path.length - 1], label: 'B', title: request.destination },
        ]
        for (const { point, label, title } of endpoints) {
          const marker = new AdvancedMarkerElement({
            position: { lat: point.lat, lng: point.lng }, title, gmpClickable: true,
          })
          marker.append(new PinElement({ glyphText: label }))
          const onClick = () => {
            infoWindow.setContent(document.createTextNode(title))
            infoWindow.open({ map: currentMap, anchor: marker, shouldFocus: false })
          }
          marker.addEventListener('gmp-click', onClick)
          markers.push({ marker, onClick })
          marker.map = currentMap
        }
        currentMap.fitBounds(route.viewport, 32)
        warnings.value = route.warnings ?? []
      } catch (cause) {
        if (disposed || currentRequest !== requestId) return
        clearRoute()
        error.value = 'Veibeskrivelsen kunne ikke lastes. Prøv igjen senere eller åpne ruten i Google Maps.'
        console.error('Could not load the hotel-to-arena route', cause)
      } finally {
        if (!disposed && currentRequest === requestId) loading.value = false
      }
    }

    onMounted(async () => {
      try {
        const api = await getGoogleMapsLoader().load()
        if (disposed || !mapDiv.value) return
        map = new api.maps.Map(mapDiv.value, {
          zoom: 14, mapId: GOOGLE_MAP_ID,
          mapTypeControl: false, streetViewControl: false, gestureHandling: 'cooperative',
        })
        await updateRoute()
      } catch (cause) {
        if (disposed) return
        error.value = 'Kartet kunne ikke lastes. Prøv igjen senere eller åpne Google Maps.'
        loading.value = false
        console.error('Could not load the event map', cause)
      }
    })
    watch(() => [props.origin, props.destination, travelMode.value], updateRoute)
    watch(googleMapsError, message => {
      if (message) {
        ++requestId
        clearRoute()
        loading.value = false
      }
    })
    onBeforeUnmount(() => {
      disposed = true
      ++requestId
      clearRoute()
      if (map) google.maps.event.clearInstanceListeners(map)
    })
    return { mapDiv, modeGroup, travelMode, loading, mapError, warnings, directionsUrl }
  },
})
</script>

<style scoped>
.travel-modes {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: .9rem;
}
.travel-modes legend { margin-bottom: .65rem; font-weight: 700; }
.travel-modes label { display: flex; align-items: center; gap: .5rem; cursor: pointer; }
.travel-modes input { accent-color: #b91c1c; }
.travel-modes input:focus-visible { outline: 2px solid #b91c1c; outline-offset: 3px; }
.map-frame { position: relative; height: clamp(20rem, 50vh, 32rem); border: 1px solid #dedbd4; }
.map-canvas { width: 100%; height: 100%; }
.map-message {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  background: #f4f0e7;
  color: #18191e;
  text-align: center;
}
.route-warning { margin-top: .75rem; font-size: .8rem; line-height: 1.6; color: #62605c; }
.directions-link { display: inline-block; margin-top: 1rem; text-decoration: underline; font-weight: 700; }
.directions-link:focus-visible { outline: 2px solid #b91c1c; outline-offset: 4px; }
</style>
