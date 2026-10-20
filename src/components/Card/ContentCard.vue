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
    <figure v-if="currentMedia" class="my-2">
      <img
        v-if="currentMedia.type === 'IMAGE'"
        :key="mediaIndex"
        :src="currentMedia.src"
        :alt="`Bilde ${mediaIndex + 1} fra ${card.title}`"
        class="w-full block"
        style="object-fit: contain"
        @error="mediaFailed = true"
        @load="mediaFailed = false"
        @touchstart.passive="startSwipe"
        @touchend.passive="endSwipe"
      />
      <video
        v-else
        :key="mediaIndex"
        :src="currentMedia.src"
        :aria-label="`Video fra ${card.title}`"
        controls
        playsinline
        preload="metadata"
        class="w-full block"
        style="object-fit: contain"
        @error="mediaFailed = true"
        @loadeddata="mediaFailed = false"
      >
        Nettleseren din støtter ikke videoavspilling.
      </video>
      <p v-if="mediaFailed" role="alert" class="px-4 py-2">
        Mediet kunne ikke lastes. Bruk lenken til Instagram nedenfor.
      </p>
      <figcaption v-if="card.media.length > 1" class="px-4 pt-3">
        <div class="flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Forrige medie"
            :disabled="mediaIndex === 0"
            class="media-navigation"
            @click="slide(mediaIndex - 1)"
          >
            Forrige
          </button>
          <span aria-live="polite">{{ mediaIndex + 1 }} / {{ card.media.length }}</span>
          <button
            type="button"
            aria-label="Neste medie"
            :disabled="mediaIndex === card.media.length - 1"
            class="media-navigation"
            @click="slide(mediaIndex + 1)"
          >
            Neste
          </button>
        </div>
        <div class="flex flex-wrap justify-center">
          <button
            v-for="(_, index) in card.media"
            :key="index"
            type="button"
            :aria-label="`Vis medie ${index + 1}`"
            :aria-current="index === mediaIndex ? 'true' : undefined"
            class="media-dot"
            @click="slide(index)"
          >
            <span :class="index === mediaIndex ? 'bg-red-600' : 'bg-gray-400'"></span>
          </button>
        </div>
      </figcaption>
    </figure>
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
import { ICard, ICardMedia } from '../../loaders'

const SWIPE_THRESHOLD = 50

export default defineComponent({
  name: 'ContentCard',
  props: {
    card: {
      type: Object as PropType<ICard>,
      required: true,
    },
  },
  data() {
    return { mediaIndex: 0, mediaFailed: false, touchStartX: null as number | null }
  },
  computed: {
    currentMedia(): ICardMedia | undefined {
      return this.card.media[this.mediaIndex]
    },
  },
  methods: {
    slide(index: number) {
      if (index >= 0 && index < this.card.media.length) {
        this.mediaIndex = index
        this.mediaFailed = false
      }
    },
    startSwipe(event: TouchEvent) {
      this.touchStartX = event.changedTouches[0]?.screenX ?? null
    },
    endSwipe(event: TouchEvent) {
      const start = this.touchStartX
      this.touchStartX = null
      const touch = event.changedTouches[0]
      if (start === null || !touch) return
      const difference = start - touch.screenX
      if (Math.abs(difference) >= SWIPE_THRESHOLD) {
        this.slide(this.mediaIndex + (difference > 0 ? 1 : -1))
      }
    },
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
.media-navigation {
  @apply rounded px-3 py-2 bg-black text-white font-bold disabled:opacity-40;
}
.media-dot {
  @apply w-8 h-8 flex items-center justify-center rounded;
}
.media-dot > span {
  @apply w-3 h-3 rounded-full;
}
.media-navigation:focus-visible,
.media-dot:focus-visible {
  @apply outline outline-2 outline-offset-2 outline-red-600;
}
@media (hover: hover) and (pointer: fine) {
  .readmore:hover {
    @apply bg-red-600;
  }
}
</style>
