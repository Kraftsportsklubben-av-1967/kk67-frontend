<template>
  <Card>
    <template v-slot:header>Meet header</template>

    <template v-slot:body>Body</template>
  </Card>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from './Card.vue'
export default defineComponent({
  name: 'MeetCard',
  components: {
    Card,
  },
})
</script>
