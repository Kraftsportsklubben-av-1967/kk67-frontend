<template>
  <div class="w-fit">
    <Card :key="question.title" v-for="question in questions" class="mt-5 w-full">
      <template v-slot:header>
        <h1>{{ question.title }}</h1>
      </template>
      <template v-slot:body>
        <p v-html="question.ans" />
      </template>
    </Card>
  </div>
</template>
<script lang="ts">
import Layout from '@components/Layout.vue'
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'

export default defineComponent({
  name: 'Faq',
  components: {
    Layout,
    Card,
  },

  data() {
    return {
      questions: [
        {
          title: 'Bestilling av lisens',
          ans: 'For bestilling av Lisens, henvend deg til kasserer på <a class="anchor-link" href="mailto:kk67.kasserer@gmail.com">kk67.kasserer@gmail.com</a>. Dersom dette er første gang du bestiller lisens, legg ved kursbevis fra <a class="anchor-link" href="https://renutover.no/">Ren Utøver</a>. <br> Når egenandelen på 500kr er betalt gjennom <a class="anchor-link" href="https://minidrett.nif.no/">Min Idrett</a> vil lisensen bli bestilt. <br> Bestilling av lisens kan ta opptil 1 uke, husk derfor å ta kontakt i god tid før stevne.',
        },
        {
            title: 'Stevnepåmelding',
            ans: 'Når du har lisens, kontakt <a class="anchor-link" href="mailto:kk67.styreleder@gmail.com">kk67.styrleder@gmail.com</a> for stevnepåmelding.',
        },
      ],
    }
  },
})
</script>
