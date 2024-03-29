<template>
  <Loader v-if="loading" class="h-60 w-60 mt-8 md:mt-20" />
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
    }
  },

  async created() {
    this.cards = await loadPosts()

    const pageSize = 3
    for (let i = 0; i < this.cards.length; i += pageSize) {
      const chunk = this.cards.slice(i, i + pageSize)
      this.pages.push(chunk)
    }
  },
  computed: {
    loading(): boolean {
      return this.cards.length === 0
    },
    n_pages(): number {
      return this.pages.length ?? 0
    },
  },
  methods: {
    updatePage(val: number): void {
      this.currentPage = val
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
})
</script>
