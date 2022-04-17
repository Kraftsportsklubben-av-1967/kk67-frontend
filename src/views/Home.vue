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
        <Loader v-if="!loading" class="h-48 w-48" style="margin-top: 1rem" />
        <ContentCard
          v-else
          class="mb-14"
          v-for="contentCard in cards"
          :key="contentCard.title"
          :imgSrc="contentCard.imgSrc"
          :title="contentCard.title"
          :date="contentCard.date.getUTCDate()"
          :text="contentCard.text"
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
    console.log(this.cards)
  },
  computed: {
    loading(): boolean {
      return this.cards.length === 0
    },
  },
})
</script>

<style scoped></style>
