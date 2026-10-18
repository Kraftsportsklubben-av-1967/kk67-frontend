<template>
  <nav ref="container" class="relative mx-8">
    <div
      ref="desktop"
      :class="{ 'absolute inset-0 invisible overflow-hidden': !showDesktop }"
      :aria-hidden="!showDesktop"
      :inert="!showDesktop"
    >
      <NavbarDesktop :navbar-buttons="buttons" />
    </div>
    <NavbarMobile v-if="!showDesktop" :navbar-buttons="buttons" />
  </nav>
</template>
<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import NavbarDesktop from './NavbarDesktop.vue'
import NavbarMobile from './NavbarMobile.vue'

export default defineComponent({
  name: 'Navbar',
  components: {
    NavbarDesktop,
    NavbarMobile,
  },
  setup() {
    const container = ref<HTMLElement | null>(null)
    const desktop = ref<HTMLElement | null>(null)
    const showDesktop = ref(false)
    let observer: ResizeObserver | undefined
    let measureFrame: number | undefined

    onMounted(() => {
      const nav = container.value
      const row = desktop.value?.firstElementChild
      if (!nav || !row) throw new Error('Navigation elements were not mounted')

      const measure = () => {
        showDesktop.value = window.innerWidth > 1230
          && row.getBoundingClientRect().width <= nav.getBoundingClientRect().width
      }
      observer = new ResizeObserver(() => {
        if (measureFrame !== undefined) cancelAnimationFrame(measureFrame)
        measureFrame = requestAnimationFrame(() => {
          measureFrame = undefined
          measure()
        })
      })
      observer.observe(nav)
      observer.observe(row)
      measure()
    })

    onBeforeUnmount(() => {
      observer?.disconnect()
      if (measureFrame !== undefined) cancelAnimationFrame(measureFrame)
    })

    return { container, desktop, showDesktop }
  },
  data() {
    return {
      buttons: [
        {
          title: 'NM 2027',
          path: '/nm',
        },
        {
          title: 'OM OSS',
          path: '/about',
        },
        {
          title: 'TIMEPLAN',
          path: '/schedule',
        },
        {
          title: 'REKORDER',
          path: '/records',
        },
        {
          title: 'BILDER',
          path: '/pictures',
        },
        {
          title: 'STEVNER',
          path: '/meets',
        },
        {
          title: 'POENG',
          path: '/points',
        },
        {
          title: 'OFTE STILTE SPØRSMÅL',
          path: '/faq/1',
        },
        {
          title: 'BLI MEDLEM',
          path: '/join',
          focus: true,
        },
      ],
    }
  },
})
</script>
