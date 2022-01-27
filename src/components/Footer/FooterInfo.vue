<template>
  <div class="flex sm:flex-row flex-col text-left justify-between footer-row">
    <KK67Logo :logo-color="LOGO_TYPES.WHITE_LGOO" v-if="showLogo" />
    <div class="my-2">
      <p class="text-lg">Sosiale medier</p>
      <Media class="mt-2 lg:justify-between black-box" />
    </div>
    <div>
      <p>Kontakt</p>
      <p>Styreleder</p>
      <p>{{ leaderContact.name }}</p>
      <p>+47 {{ leaderContact.number }}</p>
      <p>
        <a class="anchor-hover" :href="`mailto:${leaderContact.email}?subject=Melding til KK67`">{{
          leaderContact.email
        }}</a>
      </p>
    </div>
    <div>
      <p>Addresse</p>
      <p>Mellomveien 5 (Buran)</p>
      <p>7042 Trondheim</p>
    </div>
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
        number: '922 86 110',
        email: 'kk67.styreleder@gmail.com',
      },
      showLogo: true,
    }
  },
  created() {
    this.showLogo = window.outerWidth > 1096
    window.addEventListener('resize', () => {
      this.showLogo = window.outerWidth > 1096
    })
  },
  components: {
    KK67Logo,
    Media,
  },
})
</script>
<style scoped>
.black-box {
  outline: 2px solid black;
  outline-offset: -2px;
}

.footer-row > div {
  @apply my-2 p-4;
}

.footer-row div p {
  @apply text-sm;
}

.footer-row div p:first-child {
  @apply text-lg;
}
</style>
