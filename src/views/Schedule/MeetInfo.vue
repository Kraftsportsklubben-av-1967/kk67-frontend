<template>
  <Card class="w-full mb-4">
    <template v-slot:header><h1>Om stevner</h1></template>
    <template v-slot:body>
      <p>
        Når det holdes stevner i KK-67's lokaler vil det ikke være mulighet til å trene under selve
        stevnet. Slike stevner har varierende lengde avhengig av hvor mange deltagere. Men de pleier
        å være ca. <strong>3 timer</strong>. Nærmere informasjon om kommende stevner finner du
        <router-link class="anchor-link" to="/meets/">her</router-link>.
      </p>
      <br />
      <p>
        Å være tilskuer til stevner er alltid velkommen og det er forventet at medlemmer i klubben
        stiller opp for å hjelpe der det er nødvendig.
      </p>

      <br />
      <p>
        <em
          >Grunnet COVID restriksjoner kan det hende enkelte stevner ikke tilater tilskuere, alt
          avhengig av hva som er anbefalt av myndighetene.</em
        >
      </p>
    </template>
  </Card>
  <Card class="w-full mt-4">
    <template v-slot:header><h1>Delta på stevne</h1></template>
    <template v-slot:body>
      <p>
        For å kunne delta på et <strong>klubbstevne</strong>, er du nødt til å ha
        <strong>lisens</strong> i NSF og være medlem i KK-67. Du kan eventuelt delta som
        <em>gjesteløfter</em> dersom du har lisens men ikke er medlem av KK-67.
      </p>
      <p>For mer informasjon om lisens, finner du <a class="anchor-link">her</a>.</p>

      <br />
      <p>
        <strong>Merk</strong>: At du kan bli nektet å delta som gjesteløfter dersom det ikke er nok
        kapasitet i klubben for totalt antall løftere, da KK-67's medlemmer vil ha høyest
        prioritering for påmelding.
      </p>
      <br />
      <p>
        <strong>Merk</strong>: Dersom du er medlem av KK67 så gjøres lisensoppkjøp gjennom klubben.
        For å ordne dette tar du kontakt med styreleder
        <a href="" class="anchor-link">kk67.kasserer@gmail.com</a>
      </p>
    </template>
  </Card>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'

export default defineComponent({
  name: 'MeetInfo',
  components: {
    Card,
  },
})
</script>
