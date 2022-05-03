<template>
  <div
    class="h-full fixed z-10 left-0 w-full top-0 overflow-x-hidden duration-500 p-8 flex items-center justify-center hover:cursor-pointer"
    style="background-color: rgba(0, 0, 0, 0.75); overflow: hidden; overflow-x: hidden"
  >
    <p
      class="w-fit h-fit text-white cursor-pointer hover:text-slate-700 duration-500 px-4 absolute top-4 right-4"
      style="font-size: 60px; margin-top: -0.5rem"
    >
      &times;
    </p>
    <div class="flex flex-col relative" style="cursor: default">
      <img :src="src" alt="focused_picture" class="overlay-photo" />
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
.overlay-photo {
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
  .overlay-photo {
    width: 40rem;
  }
}
/* 2xl */

@media (min-width: 640px) {
}
</style>
