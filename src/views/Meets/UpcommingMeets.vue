<template>
  <Loader v-if="loading" class="my-auto w-48 h-48" />
  <Card v-else v-for="meet in upcommingMeets" class="mb-8 h-fit">
    <template v-slot:header>
      <h1>{{ meet.title }}</h1>
    </template>
    <template v-slot:body>
      <div class="flex justify-between flex-col md:pb-0 pb-2">
        <div class="flex lg:flex-row flex-col justify-between">
          <p>Dato: {{ meet.startDate.toLocaleDateString() }}</p>
          <p>{{ meet.weighIn }}</p>
        </div>
        <div class="flex lg:flex-row flex-col justify-between mt-2">
          <a :href="meet.url" target="_blank" class="anchor-link">Mer info </a>
          <p>
            For å melde deg på send mail til
            <br />
            <a
              :href="`mailto:kk67.styreleder@gmail.com?subject=Påmelding til stevne den ${meet.startDate}`"
              class="anchor-link"
              >kk67.styreleder@gmail.com</a
            >
          </p>
        </div>
      </div></template
    >
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IUpcommingMeet, cacheMeets, MeetType } from '../../loaders/loadData'
import Card from '@components/Card/Card.vue'
import Loader from '@components/Loader.vue'

export default defineComponent({
  name: 'PreviousMeets',
  data() {
    return {
      upcommingMeets: [] as IUpcommingMeet[],
    }
  },
  async created() {
    this.upcommingMeets = await cacheMeets<IUpcommingMeet[]>('upcommingMeets', MeetType.UPCOMING)
  },
  components: {
    Card,
    Loader,
  },
  computed: {
    loading(): boolean {
      return this.upcommingMeets.length === 0
    },
  },
})
</script>
