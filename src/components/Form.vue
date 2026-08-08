<template>
  <form class="w-full flex flex-col py-2">
    <label>Email addresse:</label>
    <input type="email" name="email" v-model="email" />
    <label>Navn: </label>
    <input type="text" name="name" v-model="name" />
    <label>Emne: </label>
    <input type="text" name="header" v-model="subject" />
    <label>Melding: </label>
    <textarea type="text" name="body" v-model="body" style="height: 10rem; resize: none" />
    <button
      class="block bg-red-600 p-2 text-white font-bold text-lg border rounded-lg hover:opacity-70 duration-200 ease-linear"
      @click.prevent="submit"
    >
      Send
    </button>
  </form>
</template>
<script lang="ts">
import { BACKEND_URL } from '../constants'
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      email: '',
      name: '',
      subject: '',
      body: '',
    }
  },
  methods: {
    async submit() {
      // if (this.isEmpty()) {
      //   return
      // }

      const response = await fetch(`${BACKEND_URL}/join`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          subject: this.subject,
          body: this.body,
          name: this.name,
        }),
      })

      console.log(response.json())
    },

    isEmpty(): boolean {
      return this.email === '' || this.body === '' || this.subject === ''
    },
  },
})
</script>
<style>
input,
textarea {
  @apply border border-black my-2;
}

label {
  @apply font-bold;
}
</style>
