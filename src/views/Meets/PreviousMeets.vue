<template>
  <Card v-for="meet in previousMeets" class="mb-8 h-40" style="width: 80%">
    <template v-slot:header>
      <h1>{{ meet.title }}</h1>
    </template>
    <template v-slot:body>
      <p v-if="meet.description">Info: {{ meet.description }}</p>
      <br v-else />
      <div class="flex justify-between md:flex-row flex-col md:pb-0 pb-2">
        <a :href="meet.link" class="anchor-link">Resultat</a>
        <p>Dato: {{ meet.date.toLocaleDateString() }}</p>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IMeet, cacheMeets, MeetType } from './loadData'
import Card from '@components/Card/Card.vue'

export default defineComponent({
  name: 'PreviousMeets',
  data() {
    return {
      previousMeets: [] as IMeet[],
    }
  },
  async created() {
    this.previousMeets = await cacheMeets<IMeet[]>('previousMeets', MeetType.PREVIOUS)
  },
  components: {
    Card: Card,
  },
})
</script>
