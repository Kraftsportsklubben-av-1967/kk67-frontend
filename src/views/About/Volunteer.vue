<template>
  <div class="flex w-full flex-col">
    <div>
      <Card>
        <template v-slot:header>
          <span v-html="voluntaryWork.content.heading"></span>
        </template>
        <template v-slot:body>
          <span v-html="voluntaryWork.content.body"></span>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card.vue'
import { voluntaryWork } from '../../../assets/aboutUsInfo'

export default defineComponent({
  components: {
    Card,
  },
  data() {
    return {
      voluntaryWork
    }
  }
})
</script>