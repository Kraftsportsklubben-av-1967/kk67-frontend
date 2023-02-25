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
        <br />
        <p>
          Her vises alle interne klubb rekorder som er satt av KK-67 utøvere på et offisielt stevne.
          Her finnes rekoder i alle ulike vekt- og aldersklasser!
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
          path: '/squat',
          focus: false,
        },
        {
          title: 'Benkpress',
          path: '/bench',
          focus: false,
        },
        {
          title: 'Markløft',
          path: '/deadlift',
          focus: false,
        },
      ] as IMenuButton[],
    }
  },
})
</script>
