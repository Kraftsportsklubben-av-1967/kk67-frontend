<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline" style="font-size: 3.75rem">
          <h2>Bli medlem</h2>
        </div>
        <div class="mt-8"></div>
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
