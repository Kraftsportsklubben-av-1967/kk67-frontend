<template>
<div>
  <div>
    <Card>
      <template v-slot:header>
        <span v-html="trainers.content.about.title"></span>
      </template>
      <template v-slot:body>
        <span v-html="trainers.content.about.content"></span>
      </template>
    </Card>
  </div>
  <div class="grid gap-8 mt-4" :class="showMobile ? 'grid-cols-1' : 'grid-cols-2'">
    <Card v-for="trainer in trainers.content.trainers">
      <template v-slot:header>
        <span v-html="trainer.name"></span>
      </template>
      <template v-slot:body>
        <span v-html="trainer.level"></span>
      </template>
    </Card>
  </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card.vue'
import { trainers } from '../../../assets/aboutUsInfo'

export default defineComponent({
  components: {
    Card,
  },
  inject: ["showMobile"],

  data() {
    return {
      trainers,
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
