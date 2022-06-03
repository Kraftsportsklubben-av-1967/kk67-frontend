<template>
  <div class="flex flex-col md:flex-row flex-wrap justify-between">
    <Card v-for="member in comitee" class="w-auto md:w-2/5 my-4 mx-2">
      <template v-slot:header>
        <span v-html="member.title"></span>
      </template>
      <template v-slot:body>
        <span v-html="member.name + '<br />' + member.email + '<br />' + member.phoneNumber"></span>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'

export default defineComponent({
  name: 'Comitee',
  components: {
    Card,
  },
  data() {
    return {
      comitee: [
        {
          title: 'Styreleder',
          name: 'Jostein Fiveltun',
          email: 'kk67.styreleder@gmail.com',
          phoneNumber: '+47 922 86 110',
        },
        {
          title: 'Nestleder',
          name: 'Damian Steinke',
          email: '',
          phoneNumber: '',
        },
        {
          title: 'Styremedlem',
          name: 'Frøya Gathen',
          email: '',
          phoneNumber: '',
        },
        {
          title: 'Styremedlem',
          name: 'Sara Rehnlund',
          email: '',
          phoneNumber: '',
        },
        {
          title: 'Kasserer',
          name: 'Knut Einar Skår',
          email: 'kk67.kasserer@gmail.com',
          phoneNumber: '',
        },
        {
          title: 'Varamedlem',
          name: 'Marius Arhaug',
          email: 'mariusarhaug@hotmail.com',
          phoneNumber: '+47 951 35 923',
        },
        {
          title: 'Varamedlem',
          name: 'Joar Finsaas',
          email: '',
          phoneNumber: '',
        },
      ],
    }
  },
})
</script>

<style></style>
