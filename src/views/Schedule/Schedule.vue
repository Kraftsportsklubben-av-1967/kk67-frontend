<template>
  <Card class="w-full">
    <template v-slot:header><h1>Åpningstider</h1></template>
    <template v-slot:body
      ><p>
        Når du blir medlem hos KK-67 vil du få en egen nøkkelbrikke som lar deg låse deg inn fra
        <strong>16:45-23:00</strong> på hverdager og fra <strong>09:00-23:00</strong> i helgene.
      </p>
      <br />
      <p>
        Etter å ha vært medlem hos oss i 6 månender kan du få oppgradert nøkkelen din til å ha tilgang mellom <strong>16:45-07:00</strong> på hverdager og 24/7 i helgene.
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
