<template>
  <article class="border rounded-xl shadow-lg flex flex-col py-2">
    <div class="content-card-text font-extrabold flex flex-row my-2 justify-between items-center">
      <h2>{{ card.title }}</h2>

      <a :href="card.href" target="_blank" class="hover:opacity-80 duration-500 ease-in-out"
        ><img
          :src="card.profileUrl"
          alt="profile_picture"
          width="50"
          height="50"
          class="border rounded-full border-black"
        />
      </a>
    </div>
    <template v-if="card.src">
      <video v-if="card.type === 'VIDEO'" controls style="object-fit: contain">
        <source :src="card.src" />
      </video>
      <figure v-if="card.type === 'CAROUSEL_ALBUM'">
        <div class="relative m-auto w-full">
          <div class="absolute top-0 text-white text-s p-3 font-bold pagination">
            {{ i + 1 }} / {{ card.carusell.length }}
          </div>
          <img
            v-if="card.carusell[i].media_type === 'IMAGE'"
            :src="card.carusell[i].media_url"
            alt="carusell_image"
            class="fade w-full"
            style="object-fit: contain: display: block;"
          />
          <video v-else controls style="object-fit: contain" :src="card.carusell[i].media_url" />
          <a class="prev" v-if="hasPrev" @click="i--">❮</a>
          <a class="next" v-if="hasNext" @click="i++">❯</a>

          <div class="text-center absolute bottom-4 w-full">
            <div class="flex flex-row mx-auto justify-center">
              <template v-for="(_, j) in card.carusell.length">
                <span @click="slide(j)" :class="i === j ? 'active dot' : 'dot'" />
              </template>
            </div>
          </div>
        </div>
      </figure>
      <img
        v-else-if="card.type === 'IMAGE'"
        :src="card.src"
        alt="card_image"
        class="w-full my-2 block"
        style="object-fit: contain"
      />
    </template>
    <div class="text-md font-normal text-left mt-2 content-card-text">
      <p>{{ card.text }}</p>
    </div>
    <div class="flex flex-row justify-between">
      <a :href="card.url" target="_blank">
        <button
          class="rounded-2xl p-1 duration-500 text-white w-32 font-bold text-base md:text-lg shadow-lg mt-4 bg-black hover:bg-red-600 mb-4"
        >
          LES MER
        </button>
      </a>
      <p class="my-auto text-base md:text-lg text-gray-600 py-2">{{ parseDate(card.date) }}</p>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ICard } from '../../loaders'
export default defineComponent({
  name: 'ContentCard',
  props: {
    card: {
      type: Object as PropType<ICard>,
      required: true,
    },
  },
  data() {
    return {
      i: 0,
    }
  },
  computed: {
    hasPrev(): boolean {
      return this.i > 0
    },
    hasNext(): boolean {
      return this.i < this.card.carusell.length - 1
    },
  },
  methods: {
    slide(n: number) {
      this.i = n
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
  @apply text-base sm:text-xl md:text-2xl;
}

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

.pagination {
  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
  transition: background-color 0.6s ease;
}

.active,
.dot:hover {
  background-color: #4e4e4e;
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
