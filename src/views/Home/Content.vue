<template>
  <section aria-label="Instagram-innlegg" :aria-busy="loading">
    <div v-if="loading" role="status">
      <Loader class="h-60 w-60 mt-8 md:mt-20" />
      <span class="sr-only">Laster Instagram-innlegg...</span>
    </div>
    <div v-else-if="error || cards.length === 0" class="mx-8 md:mx-0 space-y-4 py-8">
      <p :role="error ? 'alert' : 'status'">
        {{ error || 'Ingen Instagram-innlegg å vise akkurat nå.' }}
      </p>
      <button
        type="button"
        class="rounded-2xl px-4 py-2 bg-black text-white font-bold"
        @click="loadFeed"
      >
        Prøv igjen
      </button>
    </div>
    <template v-else>
      <ContentCard
        class="mb-14 hover:shadow-2xl ease-in-out"
        style="transition-duration: 0.5s"
        v-for="card in pages[currentPage]"
        :card="card"
        :key="card.id"
      />
      <Pagination
        :n_buttons="n_pages"
        :current-page="currentPage"
        @update="updatePage"
        class="mx-8 md:mx-0"
      />
    </template>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Pagination from '@components/Pagination.vue'
import ContentCard from '@/components/Card/ContentCard.vue'
import Loader from '@components/Loader.vue'
import { ICard, loadPosts } from '../../loaders'

export default defineComponent({
  name: 'Content',
  components: {
    Loader,
    ContentCard,
    Pagination,
  },
  data() {
    return {
      cards: [] as ICard[],
      pages: [[]] as ICard[][],
      currentPage: 1,
      loading: false,
      error: '',
    }
  },

  async created() {
    await this.loadFeed()
  },
  computed: {
    n_pages(): number {
      return this.pages.length
    },
  },
  methods: {
    async loadFeed(): Promise<void> {
      if (this.loading) return
      this.loading = true
      this.error = ''
      this.cards = []
      this.pages = [[]]
      this.currentPage = 1
      try {
        this.cards = await loadPosts()
        const pageSize = 3
        for (let i = 0; i < this.cards.length; i += pageSize) {
          this.pages.push(this.cards.slice(i, i + pageSize))
        }
      } catch (cause) {
        console.error('Could not load Instagram feed', cause)
        this.error = 'Instagram-innleggene kunne ikke lastes. Prøv igjen.'
      } finally {
        this.loading = false
      }
    },
    updatePage(val: number): void {
      this.currentPage = val
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
})
</script>
