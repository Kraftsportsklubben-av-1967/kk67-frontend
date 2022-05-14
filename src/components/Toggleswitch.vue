<template>
  <label class="switch-container">
    <input type="checkbox" @input="$emit('updateState')" />
    <span class="switch-selector shadow-lg"></span>
    <span class="switch-left">{{ options[0] }}</span>
    <span class="switch-right">{{ options[1] }}</span>
  </label>
</template>
<style scoped>
.switch-container {
  position: relative;
  display: inline-block;
  width: 180px;
  height: 40px;
  padding: 20px;
}

/* Hide default HTML checkbox */
.switch-container input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.switch-selector {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(185, 28, 28, 0.15);
  border-radius: 10px;
}

.switch-selector:before {
  position: absolute;
  content: '';
  height: calc(100% - 6px);
  width: calc(50% - 3px);
  left: 3px;
  bottom: 3px;
  @apply bg-red-700;
  border-radius: 7px;
}

input:checked + .switch-selector {
  background-color: rgba(185, 28, 28, 0.15);
}

input:checked + .switch-selector:before {
  transform: translateX(100%);
}

.switch-left {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 50%;
  bottom: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.switch-right {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 50%;
  right: 0;
  bottom: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ToggleSwitch',
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
})
</script>
