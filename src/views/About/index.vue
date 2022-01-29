<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline">
          <h1>Om oss</h1>
        </div>
        <div class="mt-8">
          <Menu :buttons="menuButtons" :show-join-button="true" current-path="/about" />
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
import Menu from '@components/Menu/Menu.vue'
export default defineComponent({
  name: 'About',
  components: { Layout, Card, Menu },
  data() {
    return {
      menuButtons: [
        {
          title: 'Om Klubben',
          path: '/',
          focus: false,
        },
        {
          title: 'Hvor finner du oss',
          path: '/location',
          focus: false,
        },
        {
          title: 'Styret',
          path: '/comitee',
          focus: false,
        },
        {
          title: 'Klubbtrenere',
          path: '/trainers',
          focus: false,
        },
        {
          title: 'Medlemmer',
          path: '/members',
          focus: false,
        },
        {
          title: 'Dugnad',
          path: '/volunteer',
          focus: false,
        },
      ],
    }
  },
})
</script>

<style></style>
