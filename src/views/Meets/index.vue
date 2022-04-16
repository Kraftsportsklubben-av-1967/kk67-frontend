<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline">
          <h1>Stevner</h1>
        </div>
        <div class="mt-8">
          <Menu :buttons="menuButtons" current-path="/meets" />
        </div>
      </div>
    </template>
    <template v-slot:main>
      <div class="flex flex-wrap w-full justify-between flex-col h-full">
        <router-view />
      </div>
    </template>
  </Layout>
</template>
<script lang="ts">
import Layout from '@components/Layout.vue'
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'
import Menu from '@components/Menu/Menu.vue'
import News from '@components/Media/News.vue'
import { IMenuButton } from '@components/Menu/MenuButton.vue'

export default defineComponent({
  name: 'Meets',
  components: {
    Layout,
    Card,
    Menu,
    News,
  },

  data() {
    return {
      menuButtons: [
        {
          title: 'Kommende stevner',
          path: '/',
          focus: false,
        },
        {
          title: 'Tidligere stevner',
          path: '/previousMeets',
          focus: false,
        },
      ] as IMenuButton[],
    }
  },
})
</script>
