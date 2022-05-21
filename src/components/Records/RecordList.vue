<template>
  <Loader v-if="loading" class="h-60 w-60" style="margin-top: 6rem" />
  <div v-else>
    <div class="flex flex-col">
      <template v-for="result in records">
        <Card v-if="result.title === undefined" class="my-2">
          <template v-slot:header>
            <h2 class="text-lg md:text-xl">{{ result.class }}kg</h2>
          </template>
          <template v-slot:body>
            <table class="table-fixed w-full text-base lg:text-lg">
              <thead>
                <tr>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lifter in result.lifters" class="py-1">
                  <td>{{ lifter.rank }}</td>
                  <td>
                    <a :href="lifter.href" target="_blank" class="anchor-link">{{ lifter.name }}</a>
                  </td>
                  <td class="text-right hidden sm:block">{{ lifter.date }}</td>
                  <td class="text-right">
                    <strong>{{ lifter.total }}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </Card>
        <h3 v-else class="my-4 text-2xl">{{ result.title }}</h3>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IRecord } from '../../loaders'
import Layout from '@components/Layout.vue'
import Card from '@components/Card/Card.vue'
import Loader from '@components/Loader.vue'

export default defineComponent({
  name: 'RecordList',
  components: { Layout, Card, Loader },
  props: {
    records: {
      required: true,
      type: Array as PropType<Array<IRecord>>,
    },
  },

  computed: {
    loading(): boolean {
      return this.records.length === 0
    },
  },
})
</script>
<style>
tr td {
  @apply py-2;
}
</style>
