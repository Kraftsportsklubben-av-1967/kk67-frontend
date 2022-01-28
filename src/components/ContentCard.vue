<template>
  <div class="border rounded-xl shadow-lg p-8 block wid">
    <div class="text-3xl font-extrabold">
      <h1>{{ title }}</h1>
    </div>
    <div class="text-lg font-bold text-zinc-800 mt-2">
      <div class="flex flex-row w-full">
        <img src="../../assets/logo/clock.png" class="clockfit" />
        <p class="mb-auto">{{ date }}</p>
      </div>
    </div>
    <div class="img mt-2">
      <img :src="imgSrc" alt="" class="imgfit" />
    </div>
    <div class="text-md font-semibold text-left mt-2">
      <p>{{ text }}</p>
    </div>
    <div class="rounded-full text-white w-32 shadow-lg mt-4">
      <button class="button">LES MER</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ContentCard',
  props: {
    imgSrc: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  computed: {
    hasHeader(): boolean {
      return !!this.$slots.header
    },
  },
})
</script>

<style scoped>
.imgfit {
  height: 400px;
  width: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
  object-position: 10% 17%;
}
.clockfit {
  height: 2%;
  width: 2%;
  margin-right: 1%;
  margin-bottom: auto;
  max-height: 6rem;
  min-width: 1.5rem;
  max-width: 1.5rem;
}
.button {
  transition-duration: 0.4s;
  height: 40px;
  width: 100%;
  font-weight: 800;
  font-size: large;
  background-color: black;
  border-radius: 9999px;
}
.button:hover {
  transition-duration: 0.4s;
  @apply bg-transparent text-white hover:bg-red-600 hover:text-black;
}
</style>
