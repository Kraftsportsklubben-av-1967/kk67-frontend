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
