<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline">
          <h2>Bli medlem</h2>
        </div>
        <div class="mt-8">
          <h2 class="text-lg"><em>Videre spørsmål?</em></h2>
          <br />
          <p>Ta kontakt med oss vel!</p>
          <p>
            <a class="anchor-link" href="mailto:kk67.styreleder@gmail.com"
              >@kk67.styreleder@gmail.com</a
            >
          </p>
        </div>
        <div class="mt-10">
          <h3 class="header-red-underline lg:text-4xl">Om styrkeløft</h3>
          <br />
          <p>
            For mer informasjon om styrkeløft, besøk hovedsiden til styrkeloft her:
            <a href="https://styrkeloft.no" target="_blank" class="anchor-link"
              ><strong>www.styrkeloft.no</strong></a
            >
          </p>
        </div>
      </div>
    </template>
    <template v-slot:main>
      <div class="flex w-full flex-col">
        <div class="flex flex-col lg:flex-row justify-between mt-4">
          <Card class="w-full lg:w-7/12">
            <template v-slot:header>
              <h1>Fordeler</h1>
            </template>
            <template v-slot:body>
              <div class="py-2">
                <ul style="display: list-item; list-style-type: disc" class="ml-4 my-2">
                  <li v-for="e in pros">{{ e }}</li>
                </ul>
              </div>
              <p>Dette er bare noen av fordelene ved å bli medlem hos KK-67!</p>
            </template>
          </Card>
          <Card class="w-full lg:w-2/5 lg:mt-0 mt-4">
            <template v-slot:header>
              <h1>Priser</h1>
            </template>
            <template v-slot:body>
              <p>
                Årsavgiften for medlemsskap hos Kraftsportsklubben av 1967 er
                <strong>100,-</strong>.
              </p>
              <br />
              <p>
                Treningsavgiften for å trene på klubbens lokaler er <strong>2400,-</strong> pr år.
                Eller <strong>200,-</strong> for hver resterende måned det kalenderåret.
              </p>
            </template>
          </Card>
        </div>
        <Card class="mt-4">
          <template v-slot:header>
            <h1>Informasjon om innmelding og betaling</h1>
          </template>
          <template v-slot:body>
            <p>
              For innmelding og/eller 2 ukers prøvetid ta kontakt med styreleder
              <strong>Jostein Fiveltun</strong> på
              <a class="anchor-link" href="mailto:kk67.styreleder@gmail.com"
                >kk67.styreleder@gmail.com</a
              >. Nye medlemmer må signere klubbkontrakt samt gjennomføre
              <strong>Antidoping Norges</strong> kurs
              <a class="anchor-link" href="https://renutover.no/">Ren Utøver</a>.
            </p>
            <br />
            <p>
              Når kursbevis fra
              <a class="anchor-link" href="https://renutover.no/">Ren Utøver</a> er mottat på
              <a class="anchor-link" href="mailto:kk67.kasserer@gmail.com"
                >kk67.kasserer@gmail.com</a
              >
              blir man meldt inn i klubben på
              <a class="anchor-link" href="https://minidrett.nif.no/">Min Idrett</a>, alle
              betalinger til klubben gjøres her.
            </p>
          </template>
        </Card>
      </div>
    </template>
  </Layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'
import Layout from '@components/Layout.vue'

export default defineComponent({
  name: 'MemberForum',
  components: {
    Card,
    Layout,
  },
  data() {
    return {
      pros: [
        '2 ukers prøvetid',
        'Det beste treningsmiljøet',
        'Løfteskole for å lære om teknikk, skadeforebygging og mer!',
        'Høy kompetanse i klubben i teknikk og treningsprogram!',
        'En sterkere kropp!',
        'Skikkelig styrkeløftutstyr!',
      ],
    }
  },
})
</script>
