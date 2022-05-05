<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline">
          <h1>Rekorder</h1>
        </div>
        <div class="mt-8">
          <Menu :buttons="menuButtons" :show-join-button="false" current-path="/records" />
        </div>
      </div>
      <div class="mt-6 text-md">
        <br>
        <p>
          Her vises alle rekorder innad klubben KK-67 i de ulike vekt- og aldersklassene som ulike
          utøvre har satt opp igjennom årene!
        </p>
        <br />
        <p>
          Alle rekorder er hentet fra
          <a
            href="https://www.styrkeloft.no/resultatservice/?id=13&page=klubb_ranking&top=5"
            class="anchor-link"
            >styrkeløft.no</a
          >
        </p>
        <br />
        <p>
          <em
            >NB: Rankingen er basert på stevneprotokoller som er registrert, og har derfor
            mangelfull historikk før år 2000.</em
          >
        </p>
        <br />
        <p>
          <em>OBS: Rankingen er blandet mellom utstyr og utstyrsfritt!</em>
        </p>
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
import { IMenuButton } from '@components/Menu/MenuButton.vue'
export default defineComponent({
  name: 'Total',
  components: { Layout, Card, Menu },
  data() {
    return {
      menuButtons: [
        {
          title: 'Sammenlagt',
          path: '/',
          focus: false,
        },
        {
          title: 'Knebøy',
          path: '/Squat',
          focus: false,
        },
        {
          title: 'Benkpress',
          path: '/Bench',
          focus: false,
        },
        {
          title: 'Markløft',
          path: '/Deadlift',
          focus: false,
        },
      ] as IMenuButton[],
    }
  },
})
</script>
