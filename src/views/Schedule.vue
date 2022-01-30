<template>
  <Layout>
    <template v-slot:sidebar
      ><Sidebar header="Timeplan"> <!--<Menu />--> </Sidebar></template
    >
    <template v-slot:main>
      <div class="flex w-full flex-col">
        <Card class="w-full">
          <template v-slot:header><h1>Timeplan</h1></template>
          <template v-slot:body><p>Ting og tang</p></template>
        </Card>
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

export default defineComponent({
  name: 'Schedule',
  components: { Layout, Sidebar, Menu, Card },
})
</script>
