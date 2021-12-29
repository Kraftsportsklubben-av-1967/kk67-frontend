<template>
  <div class="flex h-20 border-2 border-black">
    <div class="grow-0">LOGO</div>
    <div class="grow" v-for="button in navBarButtons" :key="button.title">{{ button.title }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
interface INavBarButton {
  title: string
  url: string
}

export default defineComponent({
  data() {
    return {
      navBarButtons: [
        {
          title: 'Test',
          url: '/test',
        },
      ] as INavBarButton[],
    }
  },
})
</script>

<style scoped></style>
