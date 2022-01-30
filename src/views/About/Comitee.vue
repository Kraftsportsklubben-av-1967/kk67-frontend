<template>
  <div class="grid gap-8">
    <Card v-for="member in comitee.content.members">
      <template v-slot:header>
        <span v-html="member.title"></span>
      </template>
      <template v-slot:body>
        <span v-html="member.name + `<br />` + member.phoneNumber + `<br />` + member.email"></span>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card.vue'
import { comitee } from '../../../assets/aboutUsInfo'

export default defineComponent({
  components: {
    Card,
  },
  data() {
    return {
      comitee,
    }
  },
})
</script>
