<template>
  <div class="event-video">
    <div class="video-player" :class="{ 'video-pending': !source || (source.provider === 'YouTube' && !loaded) }">
      <video
        v-if="source?.provider === 'MP4'"
        :key="source.url"
        :src="source.url"
        :aria-label="title"
        controls
        playsinline
        preload="metadata"
        @error="failed = true"
        @loadeddata="failed = false"
      >
        Nettleseren din støtter ikke videoavspilling.
      </video>
      <iframe
        v-else-if="source?.provider === 'YouTube' && loaded"
        :src="source.embedUrl"
        :title="title"
        loading="lazy"
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
      <button v-else-if="source?.provider === 'YouTube'" class="video-content video-load" type="button" @click="loaded = true">
        <span class="play-icon" aria-hidden="true"></span>
        <span class="video-heading">Last inn video</span>
        <span class="video-description">Innhold fra YouTube hentes først når du trykker.</span>
      </button>
      <div v-else class="video-content">
        <span class="play-icon" aria-hidden="true"></span>
        <p class="video-heading">Video kommer</p>
        <p class="video-description">Her blir det film fra reisen mot NM 2027.</p>
      </div>
    </div>
    <p v-if="source?.provider === 'MP4' && failed" class="video-fallback" role="alert">
      Videoen kunne ikke lastes. Prøv igjen senere.
    </p>
    <p v-if="source?.provider === 'YouTube' && loaded" class="video-fallback">
      Spilles ikke videoen av?
      <a :href="source.watchUrl" target="_blank" rel="noopener noreferrer">Åpne i YouTube</a>.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

type VideoSource =
  | { provider: 'YouTube'; embedUrl: string; watchUrl: string }
  | { provider: 'MP4'; url: string }

export default defineComponent({
  props: {
    youtubeVideoId: { type: String as PropType<string | null>, default: null },
    mp4Url: { type: String as PropType<string | null>, default: null },
    title: { type: String, required: true },
  },
  data() {
    return { loaded: false, failed: false }
  },
  computed: {
    source(): VideoSource | null {
      if (this.youtubeVideoId) {
        const id = encodeURIComponent(this.youtubeVideoId)
        return {
          provider: 'YouTube',
          embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
          watchUrl: `https://www.youtube.com/watch?v=${id}`,
        }
      }
      if (this.mp4Url) {
        return { provider: 'MP4', url: this.mp4Url }
      }
      return null
    },
  },
  watch: {
    source() {
      this.loaded = false
      this.failed = false
    },
  },
})
</script>

<style scoped>
.event-video { width: 100%; min-width: 0; }
.video-player {
  width: 100%;
  min-width: 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid #35363c;
  background: #18191e;
  color: #f4f0e7;
}
.video-pending { min-height: 13rem; }
iframe, video { display: block; width: 100%; height: 100%; border: 0; }
video { object-fit: contain; }
.video-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  text-align: center;
}
.video-heading { font-size: 1.25rem; font-weight: 700; }
.video-description { max-width: 22rem; color: #c4c1ba; font-size: .875rem; }
.play-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 3.5rem;
  height: 3.5rem;
  border: 1px solid #a6a39b;
  border-radius: 50%;
}
.play-icon::before {
  content: '';
  margin-left: 5px;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 13px solid #f4f0e7;
}
.video-load { background: transparent; transition: background 150ms; }
.video-load:hover { background: #25262d; }
.video-load:focus-visible { outline: 3px solid #f4f0e7; outline-offset: -6px; }
.video-fallback { margin-top: .75rem; color: #4a4844; font-size: .8rem; line-height: 1.6; }
.video-fallback a { text-decoration: underline; }
.video-fallback a:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  .video-load { transition: none; }
}
</style>
