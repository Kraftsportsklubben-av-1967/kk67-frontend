<template>
  <article class="border rounded-xl shadow-lg flex flex-col py-2">
    <div class="text-lg md:text-xl font-extrabold flex flex-row my-2 justify-between items-center">
      <h2>{{ card.title }}</h2>

      <a
        :href="card.href"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:opacity-80 duration-500 ease-in-out"
      >
        <img
          :src="card.profileUrl"
          alt="profile_picture"
          width="50"
          height="50"
          class="border rounded-full border-black"
        />
      </a>
    </div>
    <img
      v-if="card.src"
      :src="card.src"
      :alt="`Bilde fra ${card.title}`"
      class="w-full my-2 block"
      style="object-fit: contain"
    />
    <div v-if="card.text" class="text-md font-normal text-left mt-2 content-card-text">
      <p>{{ card.text }}</p>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-4 py-4">
      <a
        :href="card.url"
        target="_blank"
        rel="noopener noreferrer"
        class="rounded-2xl px-4 py-2 duration-500 text-white font-bold text-base md:text-lg shadow-lg bg-black readmore"
      >
        Se på Instagram
      </a>
      <time :datetime="card.date.toISOString()" class="text-base md:text-lg text-gray-600">
        {{ parseDate(card.date) }}
      </time>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ICard } from '../../loaders'

export default defineComponent({
  name: 'ContentCard',
  props: {
    card: {
      type: Object as PropType<ICard>,
      required: true,
    },
  },
  methods: {
    parseDate(date: Date): string {
      return date.toLocaleString('no-NO', {
        day: 'numeric',
        weekday: 'long',
        month: 'long',
        year: 'numeric',
      })
    },
  },
})
</script>

<style scoped lang="scss">
.content-card-text {
  @apply text-base sm:text-lg;
}

article > div {
  @apply px-4 lg:px-8 w-full;
}

article {
  overflow-wrap: break-word;
}
@media (hover: hover) and (pointer: fine) {
  .readmore:hover {
    @apply bg-red-600;
  }
}
</style>
