<template>
  <div class="flex flex-col justify-between">
    <Layout>
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
        <Loader v-if="loading" class="h-60 w-60" style="margin-top: 6rem" />
        <ContentCard
          v-else
          class="mb-14 hover:shadow-xl ease-in-out hover:mx-4"
          style="transition-duration: 0.5s"
          v-for="contentCard in cards"
          :key="contentCard.title"
          :src="contentCard.src"
          :title="contentCard.title"
          :date="parseDate(contentCard.date)"
          :text="contentCard.text"
          :url="contentCard.url"
          :type="contentCard.type"
        />
      </template>
    </Layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Layout from '@/components/Layout.vue'
import Media from '@/components/Media/Media.vue'
import ContentCard from '@/components/Card/ContentCard.vue'
import News from '@/components/Media/News.vue'
import Loader from '@components/Loader.vue'
import { ICard, loadIGPosts } from '../loaders'

export default defineComponent({
  name: 'Home',
  components: {
    Layout,
    Media,
    ContentCard,
    News,
    Loader,
  },
  data() {
    return {
      cards: [] as ICard[],
    }
  },
  async created() {
    this.cards = await loadIGPosts()
  },
  computed: {
    loading(): boolean {
      return this.cards.length === 0
    },
  },
  methods: {
    parseDate(date: Date): string {
      return date.toLocaleString('no-NO', {
        day: 'numeric',
        weekday: 'long',
        month: 'long',
        year: 'numeric',
      })
    },
  },
})
</script>

<style scoped></style>
