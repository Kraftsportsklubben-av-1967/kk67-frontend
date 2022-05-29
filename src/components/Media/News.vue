<template>
  <div class="w-full flex flex-row mb-4" @click="showDrop">
    <h1 class="header-red-underline">Nyheter fra NSF</h1>
    <div v-if="isMobile" class="h-full p-1 ml-1">
      <span v-if="hidden" class="h-full block rotate-90 text-2xl">&#x276F;</span>
      <span v-else class="h-full block -rotate-90 text-2xl">&#x276F;</span>
    </div>
  </div>
  <Loader v-if="loading" class="w-20 h-20 hidden sm:block" style="margin-left: 2rem" />
  <section v-else class="p-1 sm:block w-full duration-200" :class="{ hidden: hidden }">
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
      isMobile: false,
      hidden: true,
    }
  },
  async created() {
    this.isMobile = window.outerWidth <= 640
    window.addEventListener('resize', () => (this.isMobile = window.innerWidth <= 640))
    this.news = await loadNews()
  },
  computed: {
    loading(): boolean {
      return this.news.length === 0
    },
  },
  methods: {
    showDrop() {
      if (this.isMobile) {
        console.log('!!')
        this.hidden = !this.hidden
      }
    },
  },
  components: { Loader },
})
</script>

<style scoped lang="scss">
section {
  animation: fadein 2s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
