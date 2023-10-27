<template>
  <div class="flex w-full flex-col">
    <div>
      <Card>
        <template v-slot:header>
          <h1>Kraftsportsklubben av 1967</h1>
        </template>
        <template v-slot:body>
          <p>
            Kraftsportsklubben av 1967 (KK-67) er en av de eldste styrkeløftklubbene i Norge.
            Klubben har fostret flere landslagsutøvere, norgesrekordholdere, europarekordholdere og
            verdensrekordholdere. Vi som trener på KK-67 er stolte av å være en del av et
            kjempeflott treningsmiljø for folk på alle nivå.
          </p>
        </template>
      </Card>
    </div>
    <div class="flex flex-col lg:flex-row justify-between mt-4">
      <Card class="w-full lg:w-2/5">
        <template v-slot:header>
          <h1>Åpningstider</h1>
        </template>
        <template v-slot:body>
          <p>Det er stort sett folk på trening hver dag! <br /><br /></p>
          <p>Kjernetiden er mandag, onsdag og fredag mellom kl. 17:00 - 20:00.</p>
        </template>
      </Card>
      <Card class="w-full lg:w-7/12 lg:mt-0 mt-4">
        <template v-slot:header>
          <h1>Grasrotandelen</h1>
        </template>
        <template v-slot:body
          ><p>
            KK-67 kan motta tilskudd fra grasrotandelen! Det betyr at 5% av det du betaler når du
            tipper hos <em>norsk tipping</em> går til klubben! For å få til dette må du oppgi
            klubbens organisasjonsnummer neste gang du tipper: <strong>996 808 378</strong>
          </p></template
        >
      </Card>
    </div>
  </div>
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
