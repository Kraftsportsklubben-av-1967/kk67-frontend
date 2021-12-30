<script setup lang="ts">
import Footer from '../components/Footer.vue'
import Content from '../components/Content.vue'
import Header from '../components/Header.vue'
</script>

<template>
  <div class="flex flex-col h-screen justify-between">
    <Header class="h-40" :showBackground="true" />
    <Content />
    <Footer />
  </div>
</template>
