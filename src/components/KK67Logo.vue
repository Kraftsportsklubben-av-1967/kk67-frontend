<template>
  <div>
    <img
      @click="goToHomepage()"
      :src="selectLogo()"
      alt="kk67-logo"
      :style="`width: ${imgWidth}%; margin-top: 2px; image-rendering: crisp-edges;`"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export enum LOGO_TYPES {
  BLACK_LOGO = 'kk-logo-black.png',
  WHITE_LGOO = 'kk-logo-white.png',
  DEFAULT_LOGO = 'kk-logo.png',
}

const ASSETS_URL = '../../assets/'
export default defineComponent({
  name: 'KK67Logo',
  props: {
    logoColor: {
      type: String as PropType<LOGO_TYPES>,
      required: true,
    },
    imgWidth: {
      type: Number,
      required: true,
    },
  },

  methods: {
    selectLogo(): string {
      return this.updatePath(this.logoColor)
    },
    updatePath(logo: string) {
      return ASSETS_URL + logo
    },
    goToHomepage() {
      this.$router.push('/')
    },
  },
})
</script>

<style scoped>
img {
  transition-duration: 0.4s;
}

img:hover {
  cursor: pointer;
  opacity: 0.6;
}
</style>
