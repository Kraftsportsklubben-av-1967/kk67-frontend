<template>
  <footer class="border-red-600 border-t-4 h-fit text-white flex flex-col pt-10 bg-black">
    <FooterInfo />
    <FooterContact class="mt-6 mb-12" />
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FooterInfo from './FooterInfo.vue'
import FooterContact from './FooterContact.vue'
export default defineComponent({
  name: 'Footer',
  components: {
    FooterInfo,
    FooterContact,
  },
})
</script>

<style></style>
