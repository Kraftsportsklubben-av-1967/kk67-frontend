<template>
  <div class="stats-page">
    <div class="header-red-underline">
      <h1>KK-67 i tall</h1>
    </div>
    <p class="mt-6 max-w-3xl">
      Les om klubbens løftere, rekorder og historie. Bøkene bygger på registrerte
      konkurranseresultater og oppgir kilder og kjente mangler i datagrunnlaget.
      Les dem her, åpne PDF-en i en egen fane eller last ned en kopi.
    </p>

    <p v-if="loading" class="mt-8" role="status">Laster bøker …</p>
    <div v-else-if="error" class="mt-8" role="alert">
      <p>{{ error }}</p>
      <button class="reader-button mt-4" type="button" @click="loadCatalog">Prøv igjen</button>
    </div>
    <template v-else-if="catalog">
      <p class="mt-6 text-sm text-gray-600">Utgave {{ catalog.edition }}</p>
      <div class="mt-4 grid gap-6 md:grid-cols-2">
        <article v-for="report in catalog.reports" :key="report.id" class="book-card">
          <h2 class="text-2xl font-bold">{{ report.title }}</h2>
          <p class="mt-2 text-gray-600">{{ report.page_count }} sider · {{ formatSize(report.size_bytes) }} MB</p>
          <div class="mt-5 flex flex-wrap items-center gap-4">
            <button
              class="reader-button"
              type="button"
              :aria-pressed="selectedId === report.id"
              @click="openReader(report)"
            >Les på siden</button>
            <a
              class="anchor-link"
              :href="statsPdfUrl(report)"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Åpne ${report.title} som PDF`"
            >Åpne PDF</a>
            <a
              class="anchor-link"
              :href="statsPdfUrl(report)"
              :download="`kk67-${report.id}-${catalog.edition}.pdf`"
              :aria-label="`Last ned ${report.title} som PDF`"
            >Last ned</a>
          </div>
        </article>
      </div>

      <section v-if="selectedReport" class="mt-10" aria-labelledby="reader-title">
        <h2 id="reader-title" ref="readerTitle" class="text-2xl font-bold" tabindex="-1">
          {{ selectedReport.title }}
        </h2>
        <p class="my-4 text-sm text-gray-600">
          Visningen bruker nettleserens PDF-leser. På enheter uten støtte for dette,
          bruk «Åpne PDF» eller «Last ned» over.
        </p>
        <object
          :key="selectedReport.path"
          class="pdf-reader"
          :data="`${statsPdfUrl(selectedReport)}#view=FitH`"
          type="application/pdf"
          :aria-label="selectedReport.title"
        >
          <p class="p-6">
            Nettleseren din kan ikke vise PDF her.
            <a
              class="anchor-link"
              :href="statsPdfUrl(selectedReport)"
              target="_blank"
              rel="noopener noreferrer"
            >Åpne {{ selectedReport.title }} som PDF</a>.
          </p>
        </object>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  loadStatsCatalog,
  statsPdfUrl,
  type StatsCatalog,
  type StatsReport,
} from '../../loaders/statsLoader'

export default defineComponent({
  data() {
    return {
      catalog: null as StatsCatalog | null,
      loading: true,
      error: '',
      selectedId: '',
    }
  },
  computed: {
    selectedReport(): StatsReport | null {
      return this.catalog?.reports.find(report => report.id === this.selectedId) ?? null
    },
  },
  mounted() {
    void this.loadCatalog()
  },
  methods: {
    statsPdfUrl,
    formatSize(bytes: number): string {
      return new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 }).format(bytes / 1_000_000)
    },
    async openReader(report: StatsReport) {
      this.selectedId = report.id
      await this.$nextTick()
      const heading = this.$refs.readerTitle
      if (heading instanceof HTMLElement) heading.focus()
    },
    async loadCatalog() {
      this.loading = true
      this.error = ''
      this.catalog = null
      this.selectedId = ''
      try {
        this.catalog = await loadStatsCatalog()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Bøkene kunne ikke lastes.'
      } finally {
        this.loading = false
      }
    },
  },
})
</script>

<style scoped>
.stats-page { width: 100%; min-width: 0; }
.book-card { padding: 1.5rem; border: 1px solid #d1d5db; }
.reader-button {
  padding: .65rem 1rem;
  background: #b91c1c;
  color: white;
  font-weight: 700;
}
.reader-button:hover { background: #991b1b; }
.reader-button:focus-visible { outline: 2px solid #111827; outline-offset: 3px; }
.pdf-reader {
  display: block;
  width: 100%;
  height: 75vh;
  min-height: 24rem;
  border: 1px solid #d1d5db;
}
</style>
