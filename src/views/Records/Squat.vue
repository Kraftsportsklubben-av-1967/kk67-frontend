<template>
  <RecordList title="Knebøy" :records="results" />
</template>
<script lang="ts">
import { SQUAT } from '../../constants'
import { defineComponent } from 'vue'
import { loadRecords, IRecord } from '../../loaders'
import Layout from '@components/Layout.vue'
import Card from '@components/Card/Card.vue'
import Loader from '@components/Loader.vue'
import RecordList from '@components/RecordList.vue'

export default defineComponent({
  name: 'Squat',
  components: { Layout, Card, Loader, RecordList },
  data() {
    return {
      results: [] as IRecord[],
    }
  },
  async created() {
    this.results = await loadRecords(SQUAT, 'squat')
  },
})
</script>
