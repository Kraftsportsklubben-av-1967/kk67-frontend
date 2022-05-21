<template>
  <Loader v-if="loading" class="w-20 h-20" style="margin-left: 2rem" />
  <section v-else class="p-1 inline-block w-full">
    <div v-for="nyheter in news" :key="nyheter.title!" class="flex flex-row">
      <span class="text-red-600 pr-2">&#11044;</span>
      <div class="text-base lg:text-lg">
        <a :href="nyheter.url" target="_blank" class="anchor-link">
          {{ nyheter.title }}
        </a>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import { loadNews, INews } from '../../loaders'
import Loader from '../Loader.vue'

export default defineComponent({
  name: 'News',
  data() {
    return {
      news: [] as INews[],
    }
  },
  async created() {
    this.news = await loadNews()
  },
  computed: {
    loading(): boolean {
      return this.news.length === 0
    },
  },
  components: { Loader },
})
</script>
