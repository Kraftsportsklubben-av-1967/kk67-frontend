<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="header-red-underline">
        <h1>Rekorder</h1>
      </div>
      <div class="mt-4 text-lg">
        Her vises alle rekorder innad klubben KK-67 i de ulike vekt- og aldersklassene som ulike
        utøvre har satt opp igjennom årene!
      </div>
    </template>
    <template v-slot:main>
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
                <div class="flex flex-row justify-between">
                  <div class="flex flex-row w-2/5 justify-end">
                    <div>
                      <p>Plassering:</p>
                      <p>Navn:</p>
                    </div>
                    <div class="ml-auto">
                      <p>{{ result.rank }}</p>
                      <p>
                        <a :href="result.href" class="anchor-link" target="_blank"
                          ><strong>{{ result.name }}</strong>
                        </a>
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-row w-2/5 justify-between">
                    <div>
                      <p>Dato:</p>
                      <p>Total:</p>
                    </div>
                    <div>
                      <p>{{ result.date }}</p>
                      <p>{{ result.total }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
            <h3 v-else class="my-4 text-2xl">{{ result.title }}</h3>
          </template>
        </div>
      </div>
    </template>
  </Layout>
</template>
<script lang="ts">
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
    this.results = await loadRecords()
  },

  computed: {
    loading(): boolean {
      return this.results.length === 0
    },
  },
})
</script>
