<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <router-view class="flex-1 mb-20" />
    <Footer />
  </div>
</template>

<script lang="ts">
import Footer from './components/Footer/index.vue'
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
