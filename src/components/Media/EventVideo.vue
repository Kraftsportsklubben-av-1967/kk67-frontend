<template>
  <div class="event-video">
    <div class="video-player" :class="{ 'video-pending': !source || !loaded }">
      <iframe
        v-if="source && loaded"
        :src="source.embedUrl"
        :title="title"
        loading="lazy"
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
      <button v-else-if="source" class="video-content video-load" type="button" @click="loaded = true">
        <span class="play-icon" aria-hidden="true"></span>
        <span class="video-heading">Last inn video</span>
        <span class="video-description">Innhold fra {{ source.provider }} hentes først når du trykker.</span>
      </button>
      <div v-else class="video-content">
        <span class="play-icon" aria-hidden="true"></span>
        <p class="video-heading">Video kommer</p>
        <p class="video-description">Her blir det film fra reisen mot NM 2027.</p>
      </div>
    </div>
    <p v-if="source && loaded" class="video-fallback">
      Spilles ikke videoen av?
      <a :href="source.watchUrl" target="_blank" rel="noopener noreferrer">Åpne i {{ source.provider }}</a>.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface VideoSource {
  provider: 'YouTube' | 'Google Drive'
  embedUrl: string
  watchUrl: string
}

export default defineComponent({
  props: {
    youtubeVideoId: { type: String as PropType<string | null>, default: null },
    driveFileId: { type: String as PropType<string | null>, default: null },
    title: { type: String, required: true },
  },
  data() {
    return { loaded: false }
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
      if (this.driveFileId) {
        const id = encodeURIComponent(this.driveFileId)
        return {
          provider: 'Google Drive',
          embedUrl: `https://drive.google.com/file/d/${id}/preview`,
          watchUrl: `https://drive.google.com/file/d/${id}/view`,
        }
      }
      return null
    },
  },
  watch: {
    source() { this.loaded = false },
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
iframe { width: 100%; height: 100%; border: 0; }
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
