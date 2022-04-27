<template>
  <div
    class="h-full fixed z-10 left-0 w-full top-0 overflow-x-hidden duration-500 p-8 flex items-center justify-center hover:cursor-pointer"
    style="background-color: rgba(0, 0, 0, 0.75); overflow: hidden; overflow-x: hidden"
  >
    <div class="flex flex-col" style="cursor: default">
      <img :src="src" alt="focused_picture" />
      <p v-if="subtext" class="text-white mt-2 text-xl">{{ subtext }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PictureOverlay',
  props: {
    src: {
      type: String,
      required: true,
    },
    subtext: {
      type: String,
    },
  },
})
</script>
<style scoped lang="scss">
img {
  display: block;
  width: 100%;
  height: auto;
}

/* sm */
@media (min-width: 640px) {
}
/* md */
@media (min-width: 768px) {
  /* lg */
}
@media (min-width: 1024px) {
}

/* xl */
@media (min-width: 1280px) {
  img {
    width: 40rem;
  }
}
/* 2xl */

@media (min-width: 640px) {
}
</style>
