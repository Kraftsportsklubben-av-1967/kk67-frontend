<template>
  <div>
    <Card>
      <template v-slot:header><h1>Om klubbtrenere</h1></template>
      <template v-slot:body
        >KK-67 har flere utdannede trenere gjennom <i>Norges Stryrkeløftforbund</i>. Disse hjelper
        andre medlemmer med treningsprogrammer og teknikk på frivillig basis. Dersom du trenger
        hjelp med trening tar du kontakt med ansvarlig for klubbtrenere <b>Damian Steinke</b>. Han
        fordeler utøverne med behov for oppfølging på klubbtrenere.
      </template>
    </Card>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'

export default defineComponent({
  name: 'Trainers',
  components: {
    Card,
  },
})
</script>
