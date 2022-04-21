<template>
  <div>
    <button id="prev" @click="updatePage(currentPage - 1)">&lt&lt</button>
    <template v-for="n in n_buttons - 1" :key="n">
      <button
        :id="`pagination_${n}`"
        v-if="isAdjacent(n)"
        @click="updatePage(n)"
        :class="`${focus(n) ? 'bg-red-600 text-white' : ''}`"
      >
        {{ n }}
      </button>
    </template>
    <button v-if="currentPage !== n_buttons - 1">...</button>
    <button id="next" @click="updatePage(currentPage + 1)">&gt&gt</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Pagination',
  props: {
    n_buttons: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
  methods: {
    updatePage(n: number) {
      if (n > 0 && n < this.n_buttons) {
        this.$emit('update', n)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    focus(n: number): boolean {
      return n === this.currentPage
    },
    isAdjacent(n: number): boolean {
      return (
        n === this.currentPage ||
        n - 1 === this.currentPage ||
        n + 1 === this.currentPage ||
        n + 2 === this.currentPage
      )
    },
  },
})
</script>
<style scoped lang="scss">
button {
  @apply p-2 md:p-4 border-2 font-bold px-3 md:px-6;
  &:hover {
    @apply shadow-2xl ease-linear duration-500 bg-black text-white;
  }

  &:first-child {
    @apply rounded-l-lg;
  }

  &:last-child {
    @apply rounded-r-lg;
  }
}
</style>
