<template>
  <div>
    <div
      ref="mapDiv"
      class="shadow-lg border rounded-md hover:shadow-xl duration-300"
      style="width: 100%; height: 50vh"
    />
    <div class="mt-8 flex flex-row justify-between">
      <Card class="w-6/12">
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
      <Card class="w-5/12 h-fit">
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
import { defineComponent, onMounted, ref } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { getEnvVar } from '../../utils/getEnvVar'
import { initMap } from '../../utils/initMap'
import Card from '@components/Card.vue'
import GMaps = google.maps

const KK67_LOCATION: GMaps.LatLngLiteral = {
  lat: 63.437656,
  lng: 10.429489,
}

export default defineComponent({
  name: 'Location',
  setup() {
    const loader = new Loader({ apiKey: getEnvVar('VITE_GOOGLE_API_KEY') })
    const mapDiv = ref(null)

    onMounted(async () => {
      if (!mapDiv.value) {
        return
      }
      initMap(KK67_LOCATION, loader, mapDiv.value)
    })
    return { mapDiv }
  },
  components: {
    Card,
  },
})
</script>
