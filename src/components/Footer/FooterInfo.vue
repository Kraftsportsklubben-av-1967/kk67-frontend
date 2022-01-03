<template>
  <div class="flex md:flex-row justify-between flex-col flex-wrap gap-2">
    <div class="md:grow-0 justify-items-center ml-8">
      <KK67Logo :logo-color="LOGO_TYPES.WHITE_LGOO" />
    </div>
    <div class="flex md:flex-row flex-col text-center justify-evenly w-3/5">
      <div class="md:text-left">
        <h2>Sosiale medier</h2>
        <Media />
      </div>
      <div class="md:text-left">
        <h2>Kontakt</h2>
        <p class="text-sm font-normal">
          Styreleder <br />
          {{ leaderContact.name }} <br />
          +47 {{ leaderContact.number }} <br />
          {{ leaderContact.email }} <br />
        </p>
      </div>
      <div class="md:text-left">
        <h2>Addresse</h2>
        <p class="text-sm font-normal">
          Mellomveien 5 (Buran) <br />
          7042 Trondheim
        </p>
      </div>
    </div>
    <div class="md:text-left w-1/5 text-center">NEWSLETTER</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import KK67Logo, { LOGO_TYPES } from '../KK67Logo.vue'
import Media from '../Media.vue'
export default defineComponent({
  name: 'FooterInfo',
  data() {
    return {
      LOGO_TYPES: LOGO_TYPES,
      leaderContact: {
        name: 'Jostein Fiveltun',
        number: '134 45 678',
        email: 'kk67.styreleder@gmail.com',
      },
    }
  },
  methods: {
    phoneView(): boolean {
      return window.matchMedia('(min-width: 768px)').matches
    },
  },
  components: {
    KK67Logo,
    Media,
  },
})
</script>
