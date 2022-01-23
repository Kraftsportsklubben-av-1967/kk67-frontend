<template>
  <Layout>
    <template v-slot:sidebar></template>
    <template v-slot:main>
      <div class="flex flex-wrap w-full justify-between flex-col">
        <router-view />
      </div>
    </template>
  </Layout>
</template>
<script lang="ts">
import Layout from '@/components/Layout.vue'
import { defineComponent } from 'vue'
import { IMeet, IUpcommingMeet, getUpcommingMeets } from './loadData'
import Card from '@/components/Card/Card.vue'

export default defineComponent({
  name: 'Meets',
  components: {
    Layout,
    Card,
  },
  async created() {
    this.upcommingMeets = await getUpcommingMeets()
  },
  data() {
    return {
      previousMeets: [] as IMeet[],
      upcommingMeets: [] as IUpcommingMeet[],
    }
  },
})
</script>
