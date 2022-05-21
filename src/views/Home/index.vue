<template>
  <Layout :fullMain="true">
    <template v-slot:sidebar>
      <div class="flex flex-col md:flex-row lg:flex-col justify-between">
        <div class="w-full md:w-2/5 lg:w-full">
          <div class="header-red-underline mb-4">
            <h1>Nyheter</h1>
          </div>
          <News />
        </div>
        <div class="w-full md:w-2/5 lg:w-full mt-6 md:mt-0 lg:mt-6">
          <div class="text-lg md:text-xl w-fit">
            <p>Følg oss på sosiale medier!</p>
          </div>
          <Media class="justify-start mt-6" />
          <a href="https://www.antidoping.no/" target="_blank" class="w-fit mt-6 hidden md:block"
            ><img src="/public/logo/adno.png" alt="" class="duration-500 antidoping-icon"
          /></a>
        </div>
      </div>
    </template>
    <template v-slot:main>
      <Content />
    </template>
  </Layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Layout from '@/components/Layout.vue'
import Media from '@/components/Media/Media.vue'
import News from '@/components/Media/News.vue'
import Content from './Content.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Layout,
    Media,
    News,
    Content,
  },
})
</script>

<style scoped lang="scss">
.antidoping-icon {
  width: 8rem;
  &:hover {
    margin-left: 0.25rem;
    width: 7.75rem;
    filter: opacity(80%);
  }
}
</style>
