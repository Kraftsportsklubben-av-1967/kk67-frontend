<script setup lang="ts">
import Footer from './components/Footer.vue'
import Content from './components/Content.vue'
import Header from './components/Header.vue'
</script>

<template>
  <div class="flex flex-col h-screen justify-between">
    <Header class="h-40" :showBackground="true" />
    <Content />
    <Footer />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
