<template>
  <div class="flex flex-col">
    <div class="pb-4">
      <h1 class="text-4xl font-bold mb-4">KK-67's retningslinjer</h1>
      <em
        >Regel nr.1: Lurer du på noe etter å ha lest dette, spør en av de erfarne i klubben! :)</em
      >
      <br />
      <br />
      <p class="text-red-600 font-bold">
        Husk at vi er et idrettslag som er avhengig av at alle bidrar.
      </p>
    </div>
    <Card v-for="guideline in guidelines" class="my-2">
      <template v-slot:header>{{ guideline.title }}</template>
      <template v-slot:body>
        <ul style="display: list-item; list-style-type: disc" class="ml-4 my-2">
          <li v-for="bullet in guideline.points" v-html="bullet" class="my-2" />
        </ul>
      </template>
    </Card>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'

interface IGuideline {
  title: string
  points: string[]
}

export default defineComponent({
  name: 'Guidelines',
  components: {
    Card,
  },
  data() {
    return {
      guidelines: [
        {
          title: 'Utstyrsfordeling',
          points: [
            'Konkurranserackene er i første omgang forbehold de som skal ha <strong>tung</strong> trening/utstyrstrening',
            'Powerracks er forbeholdt løfting med strikk eller pins',
            'Eleiko og Leoko stengene er forbeholdt knebøy, benkpress og markløft!',
            'IKKE bruk Eleiko eller Leoko stenger til benkroing',
            'Sharing is caring, del utstyret!',
          ],
        },
        {
          title: 'Rydding',
          points: [
            'Vektskiver både store og små skal henge på stativene når de ikke er i bruk',
            'Stenger skal IKKE stilles opp langs veggen',
            'Søppel skal i søppelbøttene og pant i pant-posten',
            'Er søppelbøttene fulle, så henger nøkklene til søppelcontainerene inne på veggen på kontoret ved stereoen. Søppelcontaineren står utenfor porten til barnehagen. Søppelsekker ligger ved kontoret.',
          ],
        },
      ] as IGuideline[],
    }
  },
})
</script>
