<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline">
          <h1>Kalkulator</h1>
        </div>

        <div class="mt-10">
          <p>
            Her finner du en IPF points kalkulator basert på
            <a class="anchor-link" href="https://www.ipfpointscalculator.com/">Open Powerlifting</a>
          </p>
          sin online kalkulator.
        </div>
      </div>
    </template>
    <template v-slot:main>
      <div class="flex justify-between">
        <Calc class="w-2/5"></Calc>
        <Calc class="w-2/5"></Calc>
      </div>
    </template>
  </Layout>
</template>
<script lang="ts">
import Layout from '@components/Layout.vue'
import { defineComponent } from 'vue'
import Calc from '@components/Calc/Calc.vue'

interface IQuestion {
  title: string
  ans: string
}

export default defineComponent({
  name: 'CalculatePoints',
  components: {
    Layout,
    Calc,
  },

  data() {
    return {}
  },
})
</script>
