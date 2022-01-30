<template>
  <div>
    <div
      ref="mapDiv"
      class="shadow-lg border rounded-md hover:shadow-xl duration-300"
      style="width: 100%; height: 50vh"
    />
    <div class="mt-8 flex flex-row justify-between">
      <Card class="w-6/12">
        <template v-slot:header>
          <span v-html="location.content.location.heading"></span>
        </template>
        <template v-slot:body>
          <span v-html="location.content.location.body"></span>
        </template>
      </Card>
      <Card class="w-5/12 h-fit">
        <template v-slot:header>
          <span v-html="location.content.postalAdress.heading"></span>
        </template>
        <template v-slot:body>
          <span v-html="location.content.postalAdress.body"></span>
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
import { location } from '../../../assets/aboutUsInfo'

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
  data() {
    return {
      location,
    }
  },
})
</script>
