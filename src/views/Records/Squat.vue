<template>
  <Recordbox :title="'Knebøy'" :switchEnabled="true" :url="primaryURL" :keyExt="'squat'" />
</template>

<script lang="ts">
import { SQUAT } from '../../constants'
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
      primaryURL: SQUAT,
    }
  },
})
</script>
