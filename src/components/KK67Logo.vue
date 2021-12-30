<template>
  <div>
    <img
      :src="selectLogo()"
      alt="kk67-logo"
      :style="`width: ${imgWidth}%; margin-top: 2px; image-rendering: crisp-edges;`"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const ASSETS_URL = '../../assets/'
const BLACK_LOGO = 'kk-logo-black.png'
const WHITE_LGOO = 'kk-logo-white.png'
const DEFAULT_LOGO = 'kk-logo.png'
export default defineComponent({
  name: 'KK67Logo',
  props: {
    blackLogo: {
      type: Boolean,
      required: true,
    },
    whiteLogo: {
      type: Boolean,
      required: true,
    },
    imgWidth: {
      type: Number,
      required: true,
    },
  },

  methods: {
    selectLogo(): string {
      if (this.blackLogo) {
        return this.updatePath(BLACK_LOGO)
      }
      if (this.whiteLogo) {
        return this.updatePath(WHITE_LGOO)
      }
      return this.updatePath(DEFAULT_LOGO)
    },
    updatePath(logo: string) {
      return ASSETS_URL + logo
    },
  },
})
</script>

<style scoped></style>
