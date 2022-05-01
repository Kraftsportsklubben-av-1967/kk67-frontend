<template>
  <article class="border rounded-xl shadow-lg flex flex-col">
    <div class="text-2xl font-extrabold mt-8">
      <h2>{{ title }}</h2>
    </div>
    <div class="text-lg font-bold my-2">
      <div class="flex flex-row">
        <img
          src="/public/logo/clock.png"
          class="clockfit"
          style="width: fit-content"
          alt="clock_image"
        />
        <p class="mb-auto">{{ date }}</p>
      </div>
    </div>
    <video v-if="type === 'VIDEO'" controls style="object-fit: contain">
      <source :src="src" />
    </video>
    <figure v-if="type === 'CAROUSEL_ALBUM'">
      <div class="relative m-auto w-full">
        <div class="absolute top-0 text-white text-s px-6 py-8 font-bold">
          {{ i + 1 }} / {{ carusell.length }}
        </div>
        <a class="prev" @click="prev">❮</a>
        <img
          v-if="carusell[i].media_type === 'IMAGE'"
          :src="carusell[i].media_url"
          alt="carusell_image"
          class="fade w-full"
          style="object-fit: contain: display: block;"
        />
        <video v-else controls style="object-fit: contain" :src="carusell[i].media_url" />
        <a class="next" @click="next">❯</a>
        <div class="text-center absolute bottom-4 w-full">
          <div class="flex flex-row mx-auto justify-center">
            <template v-for="(_, j) in carusell.length">
              <span @click="slide(j)" :class="i === j ? 'active dot' : 'dot'" />
            </template>
          </div>
        </div>
      </div>
    </figure>
    <img
      v-else-if="src"
      :src="src"
      alt="card_image"
      class="w-full my-2 block"
      style="object-fit: contain"
    />
    <div class="text-md font-normal text-left text-xl mt-2">
      <p>{{ text }}</p>
    </div>
    <div>
      <a :href="url" target="_blank">
        <button
          class="rounded-2xl p-1 duration-500 font-bold text-white w-32 shadow-lg mt-4 text-lg bg-black hover:bg-red-600 mb-4"
        >
          LES MER
        </button>
      </a>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ICarusell } from '../../loaders'
export default defineComponent({
  name: 'ContentCard',
  props: {
    src: {
      type: String,
    },
    title: {
      type: String,
    },
    type: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    carusell: {
      type: Array as PropType<Array<ICarusell>>,
      required: true,
    },
  },
  data() {
    return {
      i: 0,
    }
  },
  computed: {
    hasHeader(): boolean {
      return !!this.$slots.header
    },
  },
  methods: {
    prev() {
      if (this.i > 0) {
        this.i--
      }
    },
    next() {
      if (this.i < this.carusell.length - 1) {
        this.i++
      }
    },
    slide(n: number) {
      this.i = n
    },
  },
})
</script>

<style scoped>
article > div {
  @apply px-4 lg:px-8 w-full;
}

article {
  overflow-wrap: break-word;
}
.clockfit {
  height: 2%;
  width: 2%;
  margin-right: 1%;
  margin-bottom: auto;
  max-height: 6rem;
  min-width: 1.5rem;
  max-width: 1.5rem;
}

.dot {
  cursor: pointer;
  height: 15px;
  width: 15px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.active,
.dot:hover {
  background-color: #717171;
}

.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  padding: 16px;
  margin-top: -22px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
}

.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}

.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
