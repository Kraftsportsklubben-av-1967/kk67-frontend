<template>
    <div class="lg:flex lg:mt-0 lg:justify-evenly w-full">
        <Calc class="mt-10 lg:mt-0" />
        <Calc class="mt-10 lg:mt-0"/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Calc from './Calc.vue'

export default defineComponent({
    name: 'Points',
    components: {
        Calc,
    },
  })


</script>
  
