<template>
  <Recordbox :title="'Markløft'" :switchEnabled="true" :url="primaryURL" :keyExt="'deadlift'" />
</template>

<script lang="ts">
import { DEADLIFT } from '../../constants'
import { defineComponent } from 'vue'
import Layout from '@components/Layout.vue'
import Card from '@components/Card/Card.vue'
import Loader from '@components/Loader.vue'
import Recordbox from '@components/Records/Recordbox.vue'

export default defineComponent({
  name: 'Deadlift',
  components: { Layout, Card, Loader, Recordbox },
  data() {
    return {
      switchState: false,
      primaryURL: DEADLIFT,
    }
  },
})
</script>
