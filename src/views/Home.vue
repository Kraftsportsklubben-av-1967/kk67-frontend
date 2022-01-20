<template>
  <div class="flex flex-col justify-between">
    <Layout>
      <template v-slot:sidebar>
        <div class="flex flex-col">
          <div class="header-red-underline">
            <h1>Nyheter</h1>
          </div>
          <div class="mt-6 font-bold text-sm w-fit">
            <p>Følg oss på sosiale medier!</p>
          </div>
          <div>
            <Media />
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
import Media from '../components/Media.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Layout,
    Media,
  },
})
</script>
