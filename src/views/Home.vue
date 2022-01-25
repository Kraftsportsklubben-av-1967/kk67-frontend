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
            <Media />
          </div>
        </div>
      </template>
      <template v-slot:main>
        <content-card
          class="flex flex-col justify-between mt-4"
          id="nyheter"
          v-for="contentCard in data"
          :key="contentCard.title"
          :imgSrc="contentCard.imgSrc"
          :title="contentCard.title"
          :date="contentCard.date"
          :text="contentCard.text"
        />
        <!-- <template v-slot:header>
            <h1>NM utstyrsfritt for ungdom, junior og veteran.</h1>
          </template>
          <template v-slot:text> 21-23. april. </template>
          <template v-slot:body>
            <p>Her kommer det tekst</p>
          </template> -->
      </template>
    </Layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Layout from '../components/Layout.vue'
import Media from '../components/Media.vue'
import ContentCard from '../components/ContentCard.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Layout,
    Media,
    ContentCard,
  },
  data() {
    return {
      data: [
        {
          imgSrc: '../../assets/logo/knut_test.jpeg',
          title: 'Wallahi',
          date: '21-23. april.',
          text: 'Se knut spise pølse',
        },
        {
          imgSrc: '../../assets/logo/knut_test.jpeg',
          title: 'Wallahi',
          date: '21-23. april.',
          text: 'Se knut spise pølse',
        },
        {
          imgSrc: '../../assets/logo/knut_test.jpeg',
          title: 'Wallahi',
          date: '21-23. april.',
          text: 'Se knut spise pølse',
        },
      ],
    }
  },
})
</script>

<style scoped></style>
