<template>
  <Loader v-if="loading" class="w-20 h-20" style="margin-left: 2rem" />
  <article v-else class="p-1 inline-block w-full">
    <div v-for="nyheter in news" :key="nyheter.title!" class="flex flex-row">
      <span class="text-red-600 pr-2">&#11044;</span>
      <div class="">
        <a :href="nyheter.url" target="_blank" class="anchor-link">
          {{ nyheter.title }}
        </a>
      </div>
    </div>
  </article>

  <a href="https://www.antidoping.no/" target="_blank" class="w-fit mt-6"
    ><img src="/public/logo/adno.png" alt="" class="duration-500 antidoping-icon"
  /></a>
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
<style lang="scss">
.antidoping-icon {
  width: 8rem;
  &:hover {
    margin-left: 0.25rem;
    width: 7.75rem;
    filter: opacity(80%);
  }
}
</style>
