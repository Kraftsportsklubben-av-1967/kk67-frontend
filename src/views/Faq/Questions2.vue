<template>
  <div class="w-fit">
    <router-view />
    <Card v-bind:key="question.title" v-for="question in questions" class="mt-5 w-full">
      <template v-slot:header>
        <h1>{{ question.title }}</h1>
      </template>
      <template v-slot:body>
        <p>{{ question.ans }}</p>
      </template>
    </Card>
  </div>
</template>
<script lang="ts">
import Layout from '@components/Layout.vue'
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'
import Menu from '@components/Menu/Menu.vue'
import News from '@components/Media/News.vue'
import { IMenuButton } from '@components/Menu/MenuButton.vue'

export default defineComponent({
  name: 'Faq',
  components: {
    Layout,
    Card,
    Menu,
    News,
  },

  data() {
    return {
      questions: [
        {
          title: 'Hva er styrkeløft?',
          ans: 'I styrkeløft konkurrerer man i øvelsene knebøy, benkpress og markløft. Høyeste vekt innenfor hver vektklasse avgjør vinneren i den respektive vektklassen.',
        },
      ],
    }
  },
})
</script>
