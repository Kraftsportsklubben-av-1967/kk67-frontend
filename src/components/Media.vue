<template>
  <div class="flex flex-row">
    <div v-for="img in images">
      <a :href="img.url">
        <img
          :alt="img.alt"
          :src="'@assets/' + img.src"
          style="width: 5rem; object-fit: scale-down"
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
      images: [] as IPicture[],
    }
  },
})
</script>
