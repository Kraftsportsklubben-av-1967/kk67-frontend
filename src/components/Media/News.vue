<template>
  <article class="p-1 inline-block w-full">
    <div v-for="nyheter in news" :key="nyheter" class="flex flex-row">
      <span class="text-red-600 pr-2">&#11044;</span>
      <div class="">
        <a :href="nyheter.url" target="_blank" class="anchor-link">
          {{ nyheter.title }}
        </a>
      </div>
    </div>
    <img :src="newsImg" alt="" class="w-full my-2" />
    <div class="text-md text-left mt-2">
      <slot name="body">{{ link }}</slot>
    </div>
  </article>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import { getNews, INews } from '../../views/Meets/loadData'

export default defineComponent({
  name: 'News',
  data() {
    return {
      news: [] as INews[],
    }
  },
  async created() {
    this.news = await getNews()
  },
})
</script>
