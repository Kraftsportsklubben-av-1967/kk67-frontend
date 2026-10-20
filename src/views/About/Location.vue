<template>
  <div>
    <div
      class="relative shadow-lg border rounded-md hover:shadow-xl duration-300"
      style="width: 100%; height: 50vh"
    >
      <div v-show="!mapError" ref="mapDiv" class="w-full h-full" />
      <p v-if="mapError" role="alert" class="absolute inset-0 flex items-center justify-center p-6 bg-gray-50">
        {{ mapError }}
      </p>
      <p v-else-if="loading" role="status" class="absolute inset-0 flex items-center justify-center bg-gray-50">
        Laster kart …
      </p>
    </div>
    <a
      class="inline-block mt-3 underline"
      href="https://www.google.com/maps/search/?api=1&amp;query=Kraftsportsklubben+av+1967%2C+Mellomveien+5%2C+Trondheim"
      target="_blank"
      rel="noopener noreferrer"
    >Åpne KK-67 i Google Maps</a>
    <div class="mt-8 flex flex-col">
      <Card>
        <template v-slot:header>Hvor finner du oss</template>
        <template v-slot:body
          >Vi holder til i mellomveien 5 på Buran i Trondheim i et tilfluktsrom under Voldsminde
          barnehage. <br />
          <br />

          For å finne inngangen til KK går du inn porten til barnehagen til motsatt ende der er det
          en hvit dør med et lite KK-67 skilt til venstre for døren. Her kan du bruke nøkkelbrikke
          for å låse deg inn.</template
        >
      </Card>
      <Card class="mt-4">
        <template v-slot:header>Postaddresse</template>
        <template v-slot:body>
          KK-67 <br />
          Postboks 1072 <br />
          7042 TRONDHEIM <br />
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { initMap } from '../../utils/initMap'
import { getGoogleMapsLoader, googleMapsError } from '../../utils/googleMaps'
import Card from '@components/Card/Card.vue'

export default defineComponent({
  name: 'Location',
  setup() {
    const mapDiv = ref<HTMLElement>()
    const loading = ref(true)
    const error = ref('')
    const mapError = computed(() => googleMapsError.value || error.value)
    let disposed = false
    let cleanup: (() => void) | undefined

    onMounted(async () => {
      try {
        const loader = getGoogleMapsLoader()
        const [api, markerLibrary] = await Promise.all([loader.load(), loader.importLibrary('marker')])
        if (disposed || !mapDiv.value) return
        cleanup = initMap(mapDiv.value, api.maps, markerLibrary)
      } catch (cause) {
        if (disposed) return
        error.value = 'Kartet kunne ikke lastes. Prøv igjen senere eller åpne Google Maps.'
        console.error('Could not load the club map', cause)
      } finally {
        if (!disposed) loading.value = false
      }
    })
    onBeforeUnmount(() => {
      disposed = true
      cleanup?.()
    })
    return { mapDiv, loading, mapError }
  },
  components: {
    Card,
  },
})
</script>
