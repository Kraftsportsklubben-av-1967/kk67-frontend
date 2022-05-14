<template>
  <Recordbox :title="'Benkpress'" :switchEnabled="true" :url="primaryURL" :keyExt="'bench'" />
</template>

<script lang="ts">
import { BENCH } from '../../constants'
import { defineComponent } from 'vue'
import Layout from '@components/Layout.vue'
import Card from '@components/Card/Card.vue'
import Loader from '@components/Loader.vue'
import Recordbox from '@components/Records/Recordbox.vue'

export default defineComponent({
  name: 'Bench',
  components: { Layout, Card, Loader, Recordbox },
  data() {
    return {
      switchState: false,
      primaryURL: BENCH,
    }
  },
})
</script>
