<template>
  <RecordList title="Sammenlagt" :records="results" />
</template>
<script lang="ts">
import { TOTALS } from '../../constants'
import { defineComponent } from 'vue'
import { loadRecords, IRecord } from '../../loaders'
import Layout from '@components/Layout.vue'
import Card from '@components/Card/Card.vue'
import Loader from '@components/Loader.vue'
import RecordList from '@components/RecordList.vue'

export default defineComponent({
  name: 'Records',
  components: { Layout, Card, Loader, RecordList },
  data() {
    return {
      results: [] as IRecord[],
    }
  },
  async created() {
    this.results = await loadRecords(TOTALS, 'total')
  },
})
</script>
