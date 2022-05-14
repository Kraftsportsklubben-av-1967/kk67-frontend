<template>
  <Layout :fullMain="true">
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline mb-4">
          <h1>Nyheter</h1>
        </div>
        <News class="my-5 w-10/12" />
        <div class="mt-6 text-xl w-fit">
          <p>Følg oss på sosiale medier!</p>
        </div>
        <div class="mt-4">
          <Media class="justify-start" />
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

<style scoped></style>
