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
        <div v-if="$route.name === 'UpcommingMeets'" class="mt-8">
          <h3 class="header-red-underline" style="font-size: 1.6rem">Om kommende stevner</h3>
          <br />
          <p>
            Kommende stevner er hentet fra
            <a href="https://styrkeloft.no/terminliste" target="_blank" class="anchor-link"
              >styrkeloft.no</a
            >
            sin terminliste, du kan også sjekke ut kommende stevner som <em>ikke</em> er arrangert
            av <strong>KK-67</strong> der også!
          </p>
        </div>
        <div v-else class="mt-8">
          <h3 class="header-red-underline" style="font-size: 1.8rem">Om tidligere stevner</h3>
          <br />
          <p>
            Tidligere stevner er alle stevner der et medlem av <strong>KK-67</strong> har deltatt i.
            Dette varierer alt fra klubbstevne, NM, Nordisk, WEC, EM eller VM!
          </p>
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
