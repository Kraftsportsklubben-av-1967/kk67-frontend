<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline">
          <h1>F.A.Q</h1>
        </div>
        <div class="mt-8">
          <Menu :buttons="menuButtons" current-path="/faq" />
        </div>
        <div class="mt-10">
          <p>
            Her finner du spørsmål og svar på <em>ofte stilte spørsmål</em> om styrkeløft og KK-67.
          </p>
          <p>Finner du ikke svar på det du lurer på? Ta kontakt med oss da vel!</p>
          <p>
            <a class="anchor-link" href="mailto:kk67.styreleder@gmail.com"
              >@kk67.styreleder@gmail.com</a
            >
          </p>
        </div>
      </div>
    </template>
    <template v-slot:main>
      <div v-if="questionIndex >= 0" class="flex flex-col">
        <Card v-for="question in questions[questionIndex]" :key="question.title" class="mb-5">
          <template v-slot:header>
            <h1>{{ question.title }}</h1>
          </template>
          <template v-slot:body>
            <p v-html="question.ans" />
          </template>
        </Card>
      </div>
      <router-view v-else />
    </template>
  </Layout>
</template>
<script lang="ts">
import Layout from '@components/Layout.vue'
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'
import Menu from '@components/Menu/Menu.vue'
import News from '@components/Media/News.vue'
import { IMenuButton } from '@components/Menu/MenuButton.vue'

interface IQuestion {
  title: string
  ans: string
}

export default defineComponent({
  name: 'Faq',
  components: {
    Layout,
    Card,
    Menu,
    News,
  },

  computed: {
    questionIndex(): number {
      const number = parseInt(this.$route.params.qid as string, 10)
      if (
        (isNaN(number) || number > this.menuButtons.length - 1 || number < 0) &&
        this.$route.matched[0].children.length === 0
      ) {
        // redirect if param is not a number or number is greater than number of menu buttons or the current path is not a child path
        this.$router.replace('/')
        return -1
      }
      return number - 1
    },
  },

  data() {
    return {
      menuButtons: [
        {
          title: 'Spørsmål om KK-67',
          path: '/1',
          focus: false,
        },
        {
          title: 'For medlemmer',
          path: '/2',
          focus: false,
        },
        {
          title: 'Spørsmål om styrkeløft',
          path: '/3',
          focus: false,
        },
        {
          title: 'Retningslinjer',
          path: '/guidelines',
          focus: false,
        },
      ] as IMenuButton[],
      questions: [
        [
          {
            title: 'Hva er KK-67?',
            ans: 'Kraftsportklubben av 1967, er en av de eldste styrekløftklubbene i Norge. Klubben har fostret flere landslagsutøvere, norgesrekordholdere, europarekordholdere og verdensrekordholdere. Vi som trener på KK-67 er stolte av å være en del av et kjempeflott dopingfritt treningsmiljø for folk i alle aldre og nivå.',
          },
          {
            title: 'Hvordan er trening/åpningstidene på KK-67?',
            ans: 'KK-67 opererer som et nøkkelkortgym. Etter en prøveperiode på 6 måneder får du tilgang til lokalet når du enn skulle trenge det. Under prøverperioden kan du selv låse deg inn fra 17:00 til 23:00 i hverdagene, og i helgene mellom 09:00 til 23:00. Kjernetiden er mandag, onsdag og fredag mellom 17:00 til 21:00',
          },
          {
            title: 'Hvordan kan man bli medlem av KK-67?',
            ans: 'Kontakt oss på <a class="anchor-link" href="mailto:kk67.styreleder@gmail.com">@kk67.styreleder@gmail.com</a> eller se <strong>BLI MEDLEM</strong> for mer informasjon.',
          },
        ],
        [
          {
            title: 'Bestilling av lisens',
            ans: 'For bestilling av Lisens, henvend deg til kasserer på <a class="anchor-link" href="mailto:kk67.kasserer@gmail.com">kk67.kasserer@gmail.com</a>. Dersom dette er første gang du bestiller lisens, legg ved kursbevis fra <a class="anchor-link" href="https://renutover.no/" target="_blank">Ren Utøver</a>. <br> Videre må du betale en egenandel for lisens, denne egenandelen er 50% av lisens per dags dato. Når egenandelen er betalt gjennom <a class="anchor-link" href="https://minidrett.nif.no/" target="_blank">Min Idrett</a> vil lisensen bli bestilt. <br> Bestilling av lisens kan ta opptil 1 uke, husk derfor å ta kontakt i god tid før stevne.',
          },
          {
            title: 'Stevnepåmelding',
            ans: 'Når du har lisens, kontakt <a class="anchor-link" href="mailto:kk67.styreleder@gmail.com">kk67.styreleder@gmail.com</a> for stevnepåmelding.',
          },
        ],
        [
          {
            title: 'Hva er styrkeløft?',
            ans: 'I styrkeløft konkurrerer man i øvelsene knebøy, benkpress og markløft. Høyeste vekt innenfor hver vektklasse avgjør vinneren i den respektive vektklassen.',
          },
          {
            title: 'Hvilken vekt/alders klasser finnes det?',
            ans: 'Se denne <a class="anchor-link" href="https://styrkeloft.no/dette-er-styrkeloft/" target="_blank">lenken</a> for mer informasjon.',
          },
          {
            title: 'Hva må jeg gjøre for å kunne konkurrere?',
            ans: 'Først må du være medlem i en styrkeløft klubb, f.eks: KK-67! Videre må du signere antidopingskontrakt for Antidoping Norge. For mer informasjon se <em>For medlemmer</em> i på denne siden',
          },
        ],
      ] as IQuestion[][],
    }
  },
})
</script>
