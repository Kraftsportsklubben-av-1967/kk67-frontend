<template>
  <div class="flex flex-">
    <div v-for="img in images" class="pr-2.5">
      <a :href="img.url" target="_blank">
        <img
          :alt="img.alt"
          :src="'../../icons/' + img.src"
          style="width: 2.5rem; object-fit: scale-down"
        />
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

interface IPicture {
  src: string
  alt: string
  url: string
}

export default defineComponent({
  name: 'Home',
  data() {
    return {
      images: [
        {
          src: 'facebook-black-white.jpg',
          alt: 'facebook-black-white-icon',
          url: 'https://www.facebook.com/Kraftsportklubben1967',
        },
        {
          src: 'instagram-black-white.jpg',
          alt: 'instagram-black-white-icon',
          url: 'https://www.instagram.com/kraftsportklubben_av_1967/',
        },
        {
          src: 'youtube-black-white.jpg',
          alt: 'youtube-black-white-icon',
          url: 'https://www.youtube.com/user/KK67profile',
        },
      ] as IPicture[],
    }
  },
})
</script>
<style scoped>
img {
  transition-duration: 0.4s;
  filter: invert(100);
}

img:hover {
  cursor: pointer;
  opacity: 0.6;
}
</style>
