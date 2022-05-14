<template>
  <div>
    <MenuButton
      v-for="button in buttons"
      :title="button.title"
      :path="handlePath(button.path)"
      :focus="button.focus"
    />
    <NavbarButton
      v-if="showJoinButton"
      :title="'BLI MEDLEM'"
      :path="'/join'"
      :focus="true"
      style="padding-left: 0"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import MenuButton, { IMenuButton } from './MenuButton.vue'
import NavbarButton from '../Navbar/NavbarButton.vue'

export default defineComponent({
  name: 'Menu',
  props: {
    buttons: {
      type: Array as PropType<Array<IMenuButton>>,
      required: true,
    },
    showJoinButton: {
      type: Boolean,
      default: false,
    },
    currentPath: {
      type: String,
      required: true,
    },
  },
  methods: {
    selectFocus() {
      const URL = window.location.href
      console.log(URL)
      this.buttons.forEach((button) => {
        button.focus =
          URL.endsWith(button.path) ||
          (this.$route.path === this.currentPath && button.path === '/')
      })
    },
    handlePath(buttonPath: string): string {
      return this.currentPath + buttonPath
    },
  },
  watch: {
    $route(_to, _from) {
      this.selectFocus()
    },
  },
  mounted() {
    this.selectFocus()
  },

  components: { MenuButton, NavbarButton },
})
</script>
