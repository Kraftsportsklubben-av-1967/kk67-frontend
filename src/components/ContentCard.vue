<template>
  <article class="border rounded-xl shadow-lg flex flex-col">
    <div class="text-3xl font-extrabold mt-8">
      <h1>{{ title }}</h1>
    </div>
    <div class="text-lg font-bold my-2">
      <div class="flex flex-row">
        <img
          src="../../assets/logo/clock.png"
          class="clockfit"
          style="width: fit-content"
          alt="clock_image"
        />
        <p class="mb-auto">{{ date }}</p>
      </div>
    </div>
    <img :src="imgSrc" alt="card_image" class="w-full my-2" />
    <div class="text-md font-semibold text-left mt-2">
      <p>{{ text }}</p>
    </div>
    <div>
      <button
        class="rounded-2xl p-1 duration-500 font-bold text-white w-32 shadow-lg mt-4 text-lg bg-black hover:bg-red-600 mb-4"
      >
        LES MER
      </button>
    </div>
  </article>
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
article > div {
  @apply px-4 lg:px-8 w-full;
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
</style>
