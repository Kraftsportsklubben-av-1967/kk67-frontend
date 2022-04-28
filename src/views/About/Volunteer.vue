<template>
  <div>
    <Card>
      <template v-slot:header><h1>Dugnad på KK-67</h1></template>
      <template v-slot:body>
        <p>
          KK-67 drives på frivillig basis av klubbens medlemmer, og er <strong>ikke</strong> et
          billig treningssenter. Dette betyr at det er visse forpliktelser når man er medlem i
          klubben. Som medlem har man et ansvar ovenfor andre medlemmer, og ovenfor klubben som en
          helhet, for å bidra til et godt treningsmiljø.
        </p>
        <br />

        <p>
          Dette betyr at man skal ta vare på klubb-kamerater og at man hjelper til på trening med
          avløft, sikring ol. Ved klubbaktivitet, som stevner eller dugnad er det også forventet at
          alle som har mulighet stiller opp og hjelper. I tilleg blir medlemmer i klubben satt opp
          på <strong>vaskeliste</strong> med 2 andre klubb-kamerater 1-2 ganger i året.
        </p></template
      >
    </Card>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'

export default defineComponent({
  name: 'Volunteer',
  components: {
    Card,
  },
})
</script>
