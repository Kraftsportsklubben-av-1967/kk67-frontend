<template></template>
<script lang="ts">
import { defineComponent } from 'vue'

import { getNews } from '../../views/Meets/loadData'

export default defineComponent({
  name: 'News',
  created() {
    getNews()
  },
})
</script>
