<template>
  <div class="flex flex-col justify-between">
    <Layout>
      <template v-slot:sidebar>
        <div class="flex flex-col">
          <div class="header-red-underline">
            <h1>Nyheter</h1>
          </div>
          <div class="mt-6 text-xl w-fit">
            <p>Følg oss på sosiale medier!</p>
          </div>
          <div class="mt-4">
            <Media class="justify-start" />
          </div>
        </div>
      </template>
      <template v-slot:main>
        <ContentCard
          class="my-10"
          v-for="contentCard in cards"
          :key="contentCard.title"
          :imgSrc="resolvePath(contentCard.imgSrc)"
          :title="contentCard.title"
          :date="contentCard.date"
          :text="contentCard.text"
        />
      </template>
    </Layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Layout from '../components/Layout.vue'
import Media from '../components/Media.vue'
import ContentCard from '../components/ContentCard.vue'

const ASSETS_URL = '../../assets/logo/'

export default defineComponent({
  name: 'Home',
  components: {
    Layout,
    Media,
    ContentCard,
  },
  data() {
    return {
      cards: [
        {
          imgSrc: 'knut_søt.png',
          title: 'Wallahi',
          date: '21-23. april.',
          text: 'Se knut spise pølse',
        },
        {
          imgSrc: 'knut_søt.png',
          title: 'Wallahi',
          date: '21-23. april.',
          text: 'Se knut spise pølse',
        },
        {
          imgSrc: 'knut_søt.png',
          title: 'Wallahi',
          date: '21-23. april.',
          text: 'Se knut spise pølse',
        },
      ],
    }
  },
  methods: {
    resolvePath(path: string) {
      return ASSETS_URL + path
    },
  },
})
</script>

<style scoped></style>
