<template>
  <div class="flex flex-col h-screen justify-between">
    <Layout>
      <template v-slot:sidebar>
        <div class="flex flex-col">
          <div class="font-bold text-6xl border-b-8 border-red-700 pr-6" style="width: fit-content">
            <h1>Nyheter</h1>
          </div>
          <div class="mt-6 font-bold text-sm" style="width: fit-content">
            <p>Følg oss på sosiale medier!</p>
          </div>
          <div class="flex flex-row">
            <div v-for="img in images">
              <a :href="img.url">
                <img
                  :alt="img.alt"
                  :src="'@assets/' + img.src"
                  style="width: 5rem; object-fit: scale-down"
                />
              </a>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:main>**HER SKAL KORT LIGGE**</template>
    </Layout>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Layout from '../components/Layout.vue'

interface IPicture {
  src: string
  alt: string
  url: string
}

export default defineComponent({
  name: 'Home',
  data() {
    return {
      images: [] as IPicture[],
    }
  },
  components: {
    Layout,
  },
})
</script>
