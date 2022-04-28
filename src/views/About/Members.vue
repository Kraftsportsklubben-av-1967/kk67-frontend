<template>
  <Card>
    <template v-slot:header>
      <h1>Medlemmer</h1>
    </template>
    <template v-slot:body>
      <p>
        KK-67 pleier å ha igjennomsnitt 30-40 aktive medlemmer noe som gjør at det som regel alltid
        er noen på trening i kjernetiden. Da er det ofte mulig å få hjelp til diverse aktiviteter
      </p>
      <br />
      <p>
        Du kan se aktive medlemmer innmeldt med lisens
        <a
          class="anchor-link"
          target="_blank"
          href="https://styrkeloft.no/resultatservice/?page=klubb_vis&id=13"
          ><strong>her</strong></a
        >.
      </p>
    </template>
  </Card>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'
export default defineComponent({
  name: 'Members',
  components: {
    Card,
  },
})
</script>
