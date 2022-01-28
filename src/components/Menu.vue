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
import NavbarButton from './NavbarButton.vue'

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
    selectFocus(buttons: any) {
      var url = window.location.href

      buttons.forEach((_element: any) => {
        if (url.endsWith(_element.path)) {
          _element.focus = true
        } else {
          _element.focus = false
        }
      })
    },
  },
  watch: {
    $route(to, from) {
      this.selectFocus(this.buttons)
    },
  },
  created: function () {
    this.selectFocus(this.buttons)
  },

  components: { MenuButton, NavbarButton },
})
</script>
