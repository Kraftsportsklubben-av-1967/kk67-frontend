<template>
  <footer class="border-red-600 border-t-4 h-fit text-white flex flex-col pt-10 bg-black">
    <div class="main-container">
      <FooterInfo class="mx-8" />
      <FooterContact class="mx-8 mb-12" />
    </div>
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
