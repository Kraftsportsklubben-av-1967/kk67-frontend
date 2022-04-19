<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline" style="font-size: 3.75rem">
          <h2>Bli medlem</h2>
        </div>
        <div class="mt-8">
          <h2 class="text-lg"><em>Videre spørsmål?</em></h2>
          <br />
          <p>Ta kontakt med oss vel!</p>
          <p>
            <a class="anchor-link" href="mailto:kk67.styreleder@gmail.com"
              >@kk67.styrleder@gmail.com</a
            >
          </p>
        </div>
      </div>
    </template>
    <template v-slot:main>
      <div class="flex w-full flex-col">
        <div class="flex flex-row justify-between mt-4">
          <Card class="w-7/12">
            <template v-slot:header>
              <h1>Fordeler</h1>
            </template>
            <template v-slot:body>
              <div class="py-2">
                <div v-for="e in pros">
                  <span class="text-red-600 pr-2">&#11044;</span>
                  {{ e }}
                </div>
              </div>
              <p>Dette er bare noen av fordelene ved å bli medlem hos KK-67!</p>
            </template>
          </Card>
          <Card class="w-2/5">
            <template v-slot:header>
              <h1>Priser</h1>
            </template>
            <template v-slot:body>
              <p>
                Årsavgiften for medlemsskap hos Kraftsportsklubben av 1967 er
                <strong>kr 2500,-</strong>.
              </p>
              <br />
              <p>Fra august koster det <strong>kr 1250,-</strong> ut året.</p>
            </template>
          </Card>
        </div>
        <Card class="mt-4">
          <template v-slot:header>
            <h1>Informasjon on betaling og innmelding</h1>
          </template>
          <template v-slot:body>
            <p>
              Alle betalinger skal gå til kontonr <strong>4202.53.58206</strong>. Husk å merk
              betalingen med navn!
            </p>
            <br />
            <p>
              I tillegg til å betale må du ta kontakt med leder
              <strong>Jostein Fiveltun</strong>, samt signere kontrakt med klubben. Dette gjøres ved
              å kontakte et av styres medlemmer på trening.
            </p>
            <br />
            <p>
              For medlemmer som ønsker å konkurrere må det også signeres en antidopingkontrakt fra
              Antidoping Norge. Uten denne vil det ikke bli bestilt lisens, frist 1 uke før
              deltagelse på stevne.
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
