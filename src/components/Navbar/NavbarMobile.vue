<template>
  <div class="flex justify-between">
    <KK67Logo :logo-color="logoColor" class="my-auto ml-8 mt-6" />
    <div class="mr-8 mt-8">
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import KK67Logo, { LOGO_TYPES } from '@components/KK67Logo.vue'

export default defineComponent({
  name: 'NavbarMobile',
  components: { KK67Logo },
  props: {
    logoColor: {
      default: LOGO_TYPES.DEFAULT_LOGO,
    },
  },
  created() {
    console.log(this.logoColor)
  },
})
</script>
<style scoped>
.hamburger-line {
  width: 4rem;
  height: 3px;
  background-color: white;
  margin: 7px 0;
}
</style>
