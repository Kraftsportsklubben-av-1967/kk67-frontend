<template>
  <Transition>
    <PictureOverlay v-if="focused" @click="focused = !focused" :src="focusSrc" />
  </Transition>
  <div class="flex flex-col">
    <Layout>
      <template v-slot:sidebar>
        <div class="header-red-underline">
          <h1>Lokalet til KK-67</h1>
        </div>
      </template>
      <template v-slot:main>
        <Card>
          <template v-slot:body>
            <p>
              Lokalet bærer preg av, som dere ser på bildene under, at det ble startet opp i 1967 og
              nostalgien henger fortsatt igjen i veggene. Å trene på KK-67 er unikt eller hardcore
              som de fleste ville kalt det
            </p>
          </template>
        </Card>
      </template>
    </Layout>
    <div
      class="flex flex-col mx-8 mt-10 md:flex-row justify-between lg:px-0 md:w-5/6 sm:w-3/4 xs:w-5/6 sm:mx-auto"
    >
      <div v-for="(_, i) in 3" class="flex flex-col justify-between mb-4">
        <div
          v-for="(_, j) in 6"
          class="my-3 sm:my-6 border rounded-sm hover:shadow-2xl duration-300 ease-linear hover:cursor-pointer"
        >
          <div class="container" @click="focus(3 * j + i + 1)">
            <img
              :src="getPictureN(3 * j + i + 1)"
              :alt="`KK-${3 * j + 1 + 1}-min.jpg`"
              style="object-fit: contain; margin: 0"
            />
            <div class="overlay">
              <h2
                class="text-white text-4xl lg:text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                UTFORSK
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Card class="md:mx-auto md:w-5/6 sm:w-3/4 xs:w-5/6 mx-8">
      <template v-slot:header>
        <h2>Fotograf:</h2>
      </template>
      <template v-slot:body>
        <p>
          Bilder tatt av KK utøver <em>Njord Fornes</em>
          <a href="https://www.instagram.com/njordfornes/" class="anchor-link pl-2" target="_blank"
            >@njordfornes</a
          >
        </p>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Layout from '@components/Layout.vue'
import Card from '@components/Card/Card.vue'
import PictureOverlay from './PictureOverlay.vue'

export default defineComponent({
  name: 'Pictures',
  data() {
    return {
      focused: false,
      focusSrc: '',
    }
  },
  methods: {
    getPictureN(i: number): string {
      console.log(i)
      return `/assets/pictures/KK-${i}-min.jpg`
    },
    focus(i: number) {
      this.focused = true
      this.focusSrc = this.getPictureN(i)
    },
  },
  components: { Layout, Card, PictureOverlay },
})
</script>
<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

img {
  display: block;
  width: 100%;
}

/* sm */
@media (min-width: 640px) {
}
/* md */
@media (min-width: 768px) {
  /* lg */
  img {
    width: 20rem;
  }
}
@media (min-width: 1024px) {
  img {
    width: 22.5rem;
  }
}

/* xl */
@media (min-width: 1280px) {
  img {
    width: 25rem;
  }
}
/* 2xl */

@media (min-width: 1536px) {
  img {
    width: 31rem;
  }
}

.container {
  position: relative;
  width: 100%;
  height: auto;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  opacity: 0;
  width: 100%;
  transition: 0.5s ease;
  background-color: rgba(0, 0, 0, 0);
}

@media (hover: hover) and (pointer: fine) {
  .container:hover .overlay {
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 1;
  }
}
</style>
