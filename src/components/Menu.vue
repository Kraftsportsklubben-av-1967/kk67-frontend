<template>
  <div>
    <MenuButton
      v-for="button in buttons"
      :title="button.title"
      :path="button.path"
      :focus="button.focus"
    />
    <NavbarButton :title="'BLI MEDLEM'" :path="'/join'" :focus="true" style="padding-left: 0" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MenuButton, { IMenuButton } from './MenuButton.vue'
import NavbarButton from './Navbar/NavbarButton.vue'

export default defineComponent({
  name: 'Menu',
  data() {
    return {
      buttons: [
        {
          title: 'Om Klubben',
          path: '/about',
          focus: false,
        },
        {
          title: 'Hvor finner du oss',
          path: '/about/location',
          focus: false,
        },
        {
          title: 'Styret',
          path: '/about/comitee',
          focus: false,
        },
        {
          title: 'Klubbtrenere',
          path: '/about/trainers',
          focus: false,
        },
        {
          title: 'Medlemmer',
          path: '/about/members',
          focus: false,
        },
        {
          title: 'Dugnad',
          path: '/about/volunteer',
          focus: false,
        },
      ] as IMenuButton[],
    }
  },

  methods: {
    selectFocus() {
      const URL = window.location.href

      this.buttons.forEach((button) => {
        button.focus = URL.endsWith(button.path)
      })
    },
  },
  watch: {
    $route(_to, _from) {
      this.selectFocus()
    },
  },
  created() {
    this.selectFocus()
  },

  components: { MenuButton, NavbarButton },
})
</script>
