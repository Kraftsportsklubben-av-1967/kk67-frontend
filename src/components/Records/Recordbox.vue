<template>
  <div class="flex justify-between">
    <h1 class="text-3xl font-bold">{{ title }}</h1>
    <Toggleswitch
      v-if="switchEnabled"
      :options="['Utstyr', 'Utstyrsfritt']"
      @updateState="updateSwitch"
    />
  </div>
  <RecordList :records="results" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { loadRecords, IRecord } from '../../loaders'
import Layout from '@components/Layout.vue'
import Card from '@components/Card/Card.vue'
import Loader from '@components/Loader.vue'
import RecordList from '@components/Records/RecordList.vue'
import Toggleswitch from '@components/Toggleswitch.vue'

export default defineComponent({
  name: 'RecordBox',
  components: { Layout, Card, Loader, RecordList, Toggleswitch },
  props: {
    title: {
      required: true,
      type: String,
    },
    switchEnabled: {
      required: false,
      type: Boolean,
      default: false,
    },
    url: {
      required: true,
      type: String,
    },
    keyExt: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      results: [] as IRecord[],
      switchState: false,
    }
  },
  async created() {
    if (this.switchState) {
      this.results = await loadRecords(this.url + '&uf=1', this.keyExt + '_uf')
    } else {
      this.results = await loadRecords(this.url, this.keyExt)
    }
  },
  methods: {
    updateSwitch(): void {
      this.switchState = !this.switchState
    },
  },
  watch: {
    async switchState(_t, _f) {
      this.results = []
      if (this.switchState) {
        this.results = await loadRecords(this.url + '&uf=1', this.keyExt + '_uf')
      } else {
        this.results = await loadRecords(this.url, this.keyExt)
      }
    },
  },
})
</script>
