<template>
  <div class="flex w-full flex-col">
    <div>
      <Card>
        <template v-slot:header>
          <span v-html="about.content.aboutKK.heading"></span>
        </template>
        <template v-slot:body>
          <span v-html="about.content.aboutKK.body"></span>
        </template>
      </Card>
    </div>
    <div class="flex mt-4" :class="showMobile ? 'flex-col space-y-4' : 'flex-row justify-between space-x-4'">
      <Card :class="showMobile ? 'fill' : 'w-2/5'">
        <template v-slot:header>
          <span v-html="about.content.openingTime.heading"></span>
        </template>
        <template v-slot:body>
          <span v-html="about.content.openingTime.body"></span>
        </template>
      </Card>
      <Card :class="showMobile ? 'fill' : 'w-7/12'">
        <template v-slot:header>
          <span v-html="about.content.lotterySupport.heading"></span>
        </template>
        <template v-slot:body>
          <span v-html="about.content.lotterySupport.body"></span>
          </template>
      </Card>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card.vue'
import { about } from '../../../assets/aboutUsInfo'

export default defineComponent({
  components: {
    Card,
  },
  data() {
    return {
      about,
      showMobile: false,
    }
  },
  created() {
    this.showMobile = window.outerWidth < 1130
    window.addEventListener('resize', () => {
      this.showMobile = window.outerWidth < 1130
    })},
  })
</script>
