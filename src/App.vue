<template>
  <Header class="h-40" />
  <router-view />
  <Footer />
</template>

<script lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {},
  components: {
    Footer,
    Header,
  },
})
</script>

<style>
#app {
  text-align: center;
}
</style>
