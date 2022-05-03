<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="header-red-underline">
        <h1>Rekorder</h1>
      </div>
      <div class="mt-6 text-md">
        <p>
          Her vises alle rekorder innad klubben KK-67 i de ulike vekt- og aldersklassene som ulike
          utøvre har satt opp igjennom årene!
        </p>
        <br />
        <p>
          Alle rekorder er hentet fra
          <a
            href="https://www.styrkeloft.no/resultatservice/?id=13&page=klubb_ranking&top=5"
            class="anchor-link"
            >styrkeløft.no</a
          >
        </p>
        <br />
        <p>
          <em
            >NB: Rankingen er basert på stevneprotokoller som er registrert, og har derfor
            mangelfull historikk før år 2000.</em
          >
        </p>
        <br />
        <p>
          <em>OBS: Total rankingen er blandet mellom utstyr og utstyrsfritt!</em>
        </p>
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
