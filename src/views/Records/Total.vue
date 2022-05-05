<template>
      <Loader v-if="loading" class="h-60 w-60" style="margin-top: 6rem" />
      <div v-else>
        <h1 class="text-3xl font-bold">Sammenlagt</h1>
        <div class="flex flex-col">
          <template v-for="result in results">
            <Card v-if="result.title === undefined" class="my-2">
              <template v-slot:header>
                <h2>{{ result.class }}kg</h2>
              </template>
              <template v-slot:body>
                <table class="table-fixed w-full text-base lg:text-lg">
                  <thead>
                    <tr>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="lifter in result.lifters">
                      <td>{{ lifter.rank }}</td>
                      <td>
                        <a :href="lifter.href" target="_blank" class="anchor-link">{{
                          lifter.name
                        }}</a>
                      </td>
                      <td class="text-right">{{ lifter.date }}</td>
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
import { TOTALS, SQUAT, BENCH, DEADLIFT} from '../../constants'
import { defineComponent } from 'vue'
import { loadRecords, IRecord } from '../../loaders'
import Layout from '@components/Layout.vue'
import Card from '@components/Card/Card.vue'
import Loader from '@components/Loader.vue'

export default defineComponent({
  name: 'Records',
  components: { Layout, Card, Loader },
  data() {
    return {
      results: [] as IRecord[],
    }
  },
  async created() {
    this.results = await loadRecords(TOTALS)
  },

  computed: {
    loading(): boolean {
      return this.results.length === 0
    },
  },
})
</script>
