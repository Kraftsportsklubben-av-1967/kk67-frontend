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
      <section class="mt-8" aria-labelledby="edition-title">
        <h2 id="edition-title" class="text-2xl font-bold">Årlige utgaver</h2>
        <p class="mt-2 max-w-3xl">
          Bøkene utgis som årsutgaver. Velg blant utgavene som er tilgjengelige her;
          rapportene oppgir selv dato og avgrensning for datagrunnlaget.
        </p>
        <ol class="edition-timeline mt-4">
          <li v-for="edition in editions" :key="edition.edition_year">
            <button
              class="edition-button"
              type="button"
              :aria-pressed="selectedEdition?.edition_year === edition.edition_year"
              :aria-label="`Vis årsutgave ${edition.edition_year}`"
              @click="selectEdition(edition.edition_year)"
            >
              <span class="block text-xl font-bold">{{ edition.edition_year }}</span>
              <span class="block mt-1 text-sm">
                {{ edition.edition_year === catalog.edition_year ? 'Nyeste utgave' : 'Tidligere utgave' }}
              </span>
              <span class="block mt-1 text-sm">Utgavedato {{ edition.edition }}</span>
            </button>
          </li>
          <li v-if="catalog.next_edition_year" class="planned-edition">
            <span class="block text-xl font-bold">{{ catalog.next_edition_year }}</span>
            <span class="block mt-1 text-sm">Planlagt</span>
            <p class="mt-1 text-sm">Utgivelsesdato ikke fastsatt.</p>
          </li>
        </ol>
        <p v-if="catalog.next_edition_year === null" class="mt-3 text-sm text-gray-600">
          Planen for neste årsutgave er ikke lagt inn ennå.
        </p>
      </section>

      <template v-if="selectedEdition">
        <h2 class="mt-8 text-2xl font-bold">Årsutgave {{ selectedEdition.edition_year }}</h2>
        <p class="mt-2 text-sm text-gray-600">Utgavedato {{ selectedEdition.edition }}</p>
        <section class="mt-4" aria-labelledby="updates-title">
          <h3 id="updates-title" class="text-lg font-bold">Nytt i denne utgaven</h3>
          <ul v-if="selectedEdition.highlights.length" class="mt-2 list-disc pl-6">
            <li v-for="(note, index) in selectedEdition.highlights" :key="index">{{ note }}</li>
          </ul>
          <p v-else class="mt-2 text-sm text-gray-600">
            Ingen oppdateringsnotater er lagt inn for denne utgaven.
          </p>
        </section>
        <div class="mt-6 grid gap-6 md:grid-cols-2">
          <article v-for="report in selectedEdition.reports" :key="report.id" class="book-card">
            <h3 class="text-2xl font-bold">{{ report.title }}</h3>
            <p v-if="report.id === 'main'" class="mt-2 text-gray-700">
              Boken fremhever rapportårets konkurranseaktive og løftere med lang klubbtilknytning;
              utvalget er ikke en rangering av medlemmenes betydning for klubben.
            </p>
            <p class="mt-2 text-gray-600">
              {{ report.page_count }} sider · {{ formatSize(report.size_bytes) }} MB
            </p>
            <div class="mt-auto pt-5 flex flex-wrap items-center gap-4">
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
                :download="`kk67-${report.id}-${selectedEdition.edition}.pdf`"
                :aria-label="`Last ned ${report.title} som PDF`"
              >Last ned</a>
            </div>
          </article>
        </div>

        <section v-if="selectedReport" class="mt-10" aria-labelledby="reader-title">
          <h2 id="reader-title" ref="readerTitle" class="text-2xl font-bold" tabindex="-1">
            {{ selectedReport.title }} · {{ selectedEdition.edition_year }}
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
      <p v-else class="mt-6" role="alert">Den valgte årsutgaven finnes ikke i arkivet.</p>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  loadStatsCatalog,
  statsPdfUrl,
  type StatsCatalog,
  type StatsEdition,
  type StatsReport,
} from '../../loaders/statsLoader'

export default defineComponent({
  data() {
    return {
      catalog: null as StatsCatalog | null,
      loading: true,
      error: '',
      selectedId: '',
      selectedYear: null as number | null,
    }
  },
  computed: {
    editions(): StatsEdition[] {
      if (!this.catalog) return []
      return [...this.catalog.archive, this.catalog]
        .sort((left, right) => left.edition_year - right.edition_year)
    },
    selectedEdition(): StatsEdition | null {
      if (!this.catalog) return null
      if (this.selectedYear === null) return this.catalog
      return this.editions.find(edition => edition.edition_year === this.selectedYear) ?? null
    },
    selectedReport(): StatsReport | null {
      return this.selectedEdition?.reports.find(report => report.id === this.selectedId) ?? null
    },
  },
  mounted() {
    void this.loadCatalog()
  },
  methods: {
    statsPdfUrl,
    selectEdition(year: number) {
      this.selectedYear = year
      this.selectedId = ''
    },
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
      this.selectedYear = null
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
.book-card { display: flex; flex-direction: column; padding: 1.5rem; border: 1px solid #d1d5db; }
.edition-timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
}
.edition-button, .planned-edition {
  display: block;
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: 1px solid #d1d5db;
  text-align: left;
}
.edition-button[aria-pressed="true"] { border-color: #b91c1c; background: #fef2f2; }
.edition-button:hover { border-color: #b91c1c; }
.planned-edition { background: #f3f4f6; color: #4b5563; }
.reader-button {
  padding: .65rem 1rem;
  background: #b91c1c;
  color: white;
  font-weight: 700;
}
.reader-button:hover { background: #991b1b; }
.reader-button:focus-visible, .edition-button:focus-visible {
  outline: 2px solid #111827;
  outline-offset: 3px;
}
.pdf-reader {
  display: block;
  width: 100%;
  height: 75vh;
  min-height: 24rem;
  border: 1px solid #d1d5db;
}
</style>
