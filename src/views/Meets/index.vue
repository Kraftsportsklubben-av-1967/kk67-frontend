<template>
  <Layout>
    <template v-slot:sidebar></template>
    <template v-slot:main>
      <div class="flex flex-wrap w-full justify-between flex-col">
        <Card v-for="meet in previousMeets" class="mb-8 h-40" style="width: 80%">
          <template v-slot:header>
            <h1>{{ meet.title }}</h1>
          </template>
          <template v-slot:body>
            <p v-if="meet.description">Info: {{ meet.description }}</p>
            <br v-else />
            <div class="flex justify-between md:flex-row flex-col md:pb-0 pb-2">
              <a :href="meet.link" class="hover:opacity-80 hover:underline text-red-600"
                >Resultat</a
              >
              <p>Dato: {{ meet.date.toLocaleDateString() }}</p>
            </div>
          </template>
        </Card>
      </div>
    </template>
  </Layout>
</template>
<script lang="ts">
import Layout from '@/components/Layout.vue'
import { defineComponent } from 'vue'
import { IMeet, IUpcommingMeet, getPreviousMeets, getUpcommingMeets } from './loadData'
import Card from '@/components/Card/Card.vue'

/**
 * Cache meet data into session storage. // * This could be refactored into a general cacher.. or vuex..
 */
async function cacheMeets(): Promise<IMeet[]> {
  if (window.sessionStorage.getItem('meets')) {
    return JSON.parse(window.sessionStorage.getItem('meets')!, (key, value) => {
      return key === 'date' ? new Date(value) : value
    }) as IMeet[]
  }

  const meets = await getPreviousMeets()
  window.sessionStorage.setItem('meets', JSON.stringify(meets))
  return meets
}

export default defineComponent({
  name: 'Meets',
  components: {
    Layout,
    Card,
  },
  async created() {
    this.upcommingMeets = await getUpcommingMeets()
    this.previousMeets = await cacheMeets()
    console.log(this.upcommingMeets)
  },
  data() {
    return {
      previousMeets: [] as IMeet[],
      upcommingMeets: [] as IUpcommingMeet[],
    }
  },
})
</script>
