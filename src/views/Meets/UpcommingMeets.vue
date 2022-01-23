<template>
  <Card v-for="meet in upcommingMeet" class="mb-8 h-40" style="width: 80%">
    <template v-slot:header>
      <h1>{{ meet.title }}</h1>
    </template>
    <template v-slot:body>
      <div class="flex justify-between flex-col md:pb-0 pb-2">
        <p>Dato: {{ meet.startDate.toLocaleDateString() }}</p>
        <p>{{ meet.weighIn }}</p>
        <a :href="meet.url" target="_blank" class="anchor-link">Mer info </a>
      </div></template
    >
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getUpcommingMeets, IUpcommingMeet } from './loadData'
import Card from '@/components/Card/Card.vue'

export default defineComponent({
  name: 'PreviousMeets',
  data() {
    return {
      upcommingMeet: [] as IUpcommingMeet[],
    }
  },
  async created() {
    this.upcommingMeet = await getUpcommingMeets()
    console.log(this.upcommingMeet)
  },
  components: {
    Card,
  },
})
</script>
