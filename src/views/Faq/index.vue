<template>
  <Layout>
    <template v-slot:sidebar>
      <div class="flex flex-col">
        <div class="header-red-underline">
          <h1>F.A.Q</h1>
        </div>
        <div class="mt-8">
          <Menu :buttons="menuButtons" current-path="/faq" />
        </div>
        <div class="mt-10">
          <p>
            Her finner du spørsmål og svar på <em>ofte stilte spørsmål</em> om styrkeløft og KK-67.
          </p>
          <p>Finner du ikke svar på det du lurer på? Ta kontakt med oss da vel!</p>
          <p>
            <a class="anchor-link" href="mailto:kk67.styreleder@gmail.com"
              >@kk67.styrleder@gmail.com</a
            >
          </p>
        </div>
      </div>
    </template>
    <template v-slot:main>
      <div class="">
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
  name: 'Faq',
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
          title: 'Spørsmål om KK-67',
          path: '/',
          focus: false,
        },
        {
          title: 'Spørsmål om styrkeløft',
          path: '/questions2',
          focus: false,
        },
      ] as IMenuButton[],
    }
  },
})
</script>
