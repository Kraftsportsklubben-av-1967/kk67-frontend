<template>
  <Layout>
    <template v-slot:sidebar
      ><Sidebar header="Timeplan">
        <template v-slot:main
          ><Menu :buttons="menuButtons" :show-join-button="false" current-path="/schedule" />
        </template> </Sidebar
    ></template>
    <template v-slot:main>
      <div class="flex w-full flex-col">
        <ViewTransition :view-key="$route.path" subpage>
          <router-view />
        </ViewTransition>
      </div>
    </template>
  </Layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Layout from '@components/Layout.vue'
import Sidebar from '@components/Layout/Sidebar.vue'
import Menu from '@components/Menu/Menu.vue'
import Card from '@components/Card/Card.vue'
import ViewTransition from '@components/ViewTransition.vue'

export default defineComponent({
  name: 'Schedule',
  data() {
    return {
      menuButtons: [
        {
          title: 'Åpningstider',
          path: '/',
          focus: false,
        },
        {
          title: 'Stevner',
          path: '/meets',
          focus: false,
        },
      ],
    }
  },
  components: { Layout, Sidebar, Menu, Card, ViewTransition },
})
</script>
