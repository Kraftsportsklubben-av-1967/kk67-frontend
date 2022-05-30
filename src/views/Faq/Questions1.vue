<template>
  <div class="w-fit">
    <router-view />
    <Card v-bind:key="question.title" v-for="question in questions" class="mt-5 w-full">
      <template v-slot:header>
        <h1>{{ question.title }}</h1>
      </template>
      <template v-slot:body>
        <p v-html="question.ans"></p>
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
          title: 'Hva er KK-67?',
          ans: 'Kraftsportklubben av 1967, er en av de eldste styrekløftklubbene i Norge. Klubben har fostret flere landslagsutøvere, norgesrekordholdere, europarekordholdere og verdensrekordholdere. Vi som trener på KK-67 er stolte av å være en del av et kjempeflott dopingfritt treningsmiljø for folk i alle aldre og nivå.',
        },
        {
          title: 'Hvordan er trening/åpningstidene på KK-67?',
          ans: 'KK-67 opererer som et nøkkelkortgym. Etter en prøveperiode på 6 måneder får du tilgang til lokalet når du enn skulle trenge det. Under prøverperioden kan du selv låse deg inn mellom 17:00 og 21:00. Kjernetiden er mandag, onsdag og fredag mellom 17:00 til 21:00',
        },
        {
          title: 'Hvordan kan man bli medlem av KK-67?',
          ans: 'Kontakt oss på <a class="anchor-link" href="mailto:kk67.styreleder@gmail.com">@kk67.styrleder@gmail.com</a> eller se BLI MEDLEM for mer informasjon.',
        },
      ],
    }
  },
})
</script>
