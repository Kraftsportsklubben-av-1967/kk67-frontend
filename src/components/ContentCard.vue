<template>
  <div class="border rounded-xl shadow-lg p-8 block wid">
    <div class="text-xl font-extrabold">
      <h1>{{ title }}</h1>
    </div>
    <div class="text-l font-bold text-zinc-800 mt-2">
      <div class="flex flex-row">
        <img src="../../assets/logo/clock.png" class="clockfit" />
        <p>{{ date }}</p>
      </div>
    </div>
    <div class="img mt-2">
      <img :src="imgSrc" alt="" class="imgfit" />
    </div>
    <div class="text-md font-semibold text-left mt-2">
      <p>{{ text }}</p>
    </div>
    <div class="border rounded-full text-white w-32 bg-black mt-5 shadow-lg">
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
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 0.75rem;
  object-position: 10% 17%;
}
.clockfit {
  width: 2%;
  margin-right: 0.5%;
}
.button {
  height: 40px;
  width: 100%;
  font-weight: 800;
  font-size: large;
}
</style>
