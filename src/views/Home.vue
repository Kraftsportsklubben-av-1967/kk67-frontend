<template>
  <div class="flex flex-col h-screen justify-between m-4">
    <Content />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Content from '../components/Content.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Content,
  },
})
</script>
