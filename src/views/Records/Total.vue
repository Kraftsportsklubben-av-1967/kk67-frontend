<template>
  <Recordbox :title="'Sammenlagt'" :switchEnabled="true" :url="primaryURL" :keyExt="'total'" />
</template>

<script lang="ts">
import { TOTALS } from '../../constants'
import { defineComponent } from 'vue'
import Layout from '@components/Layout.vue'
import Card from '@components/Card/Card.vue'
import Loader from '@components/Loader.vue'
import Recordbox from '@components/Records/Recordbox.vue'

export default defineComponent({
  name: 'Squat',
  components: { Layout, Card, Loader, Recordbox },
  data() {
    return {
      switchState: false,
      primaryURL: TOTALS,
    }
  },
})
</script>
