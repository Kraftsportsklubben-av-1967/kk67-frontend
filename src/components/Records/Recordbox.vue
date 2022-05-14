<template>
  <div class="flex justify-between">
    <h1 class="text-3xl font-bold">{{ title }}</h1>
    <Toggleswitch
      v-if="switchEnabled"
      :options="['Utstyr', 'Utstyrsfritt']"
      @updateState="updateSwitch"
    ></Toggleswitch>
  </div>
  <RecordList v-if="!switchState" :records="results" />
  <RecordList v-if="switchState" :records="resultsUF" />
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
    primaryURL: {
      required: true,
      type: String,
    },
    primaryID: {
      required: true,
      type: String,
    },
    secondaryURL: {
      required: false,
      type: String,
      default: 'null',
    },
    secondaryID: {
      required: false,
      type: String,
      default: 'null',
    },
  },
  data() {
    return {
      results: [] as IRecord[],
      resultsUF: [] as IRecord[],
      switchState: false,
    }
  },
  async created() {
    this.results = await loadRecords(this.primaryURL, this.primaryID)
    if (this.secondaryURL != 'null') {
      this.resultsUF = await loadRecords(this.secondaryURL, this.secondaryID)
    }
  },
  methods: {
    updateSwitch(state): void {
      this.switchState = state
    },
  },
})
</script>
