<template>
  <Card class="w-full">
    <template v-slot:header><h1>Åpningstider</h1></template>
    <template v-slot:body
      ><p>
        Når du blir medlem hos KK-67 vil du få en egen nøkkelbrikke som lar deg låse deg inn fra
        <strong>17:00-23:00</strong> på hverdager og fra <strong>09:00-23:00</strong> i helgene.
      </p>
      <br />
      <p>
        Etter å ha vært medlem hos oss i 6 månender kan du få oppgradert nøkkelen din til å ha 24/7
        tilgang til KK's lokaler.
      </p>
      <br />
      <p>
        <strong>Merk:</strong>
        Ettersom KK's lokaler ligger under Voldsminde barnehage, er det viktig å sjekke at døren er
        skikkelig låst dersom du velger å trene i barnehagens åpningstider. Videre er det også
        viktig at du spiller veldig lav musikk når du trener under barnehagens åpningstider.
        (07:00-17:00)
      </p>
    </template>
  </Card>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'

export default defineComponent({
  components: {
    Card,
  },
})
</script>
