<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline">
          <h1>Om oss</h1>
        </div>
        <div class="mt-8">
          <Menu />
        </div>
      </div>
    </template>
    <template v-slot:main>
      <router-view />
    </template>
  </Layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Layout from '@components/Layout.vue'
import Card from '@components/Card/Card.vue'
import Menu from '@components/Menu.vue'
export default defineComponent({
  name: 'About',
  components: { Layout, Card, Menu },
})
</script>

<style></style>
