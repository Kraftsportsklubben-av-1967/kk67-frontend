<template>
  <div class="h-20 text-sm flex flex-row justify-evenly">
    <div class="my-5 mx-auto w-fit font-thin text-gray-700 px-4">
      <h1 class="font-bold">Oppdaget en feil?</h1>
      <p>Vi tar gjerne imot feedback!</p>
      <p>Du kan sende feedback/feil ved å sende mail til:</p>
      <p>
        <a
          href="mailto:mariusarhaug@hotmail.com?subject=Bug med KK67 nettside!&body=Oppdaget følgende feil: "
          target="_blank"
          class="anchor-hover"
          >mariusarhaug@hotmail.com</a
        >
      </p>
    </div>
    <div class="my-5 mx-auto w-fit font-thin text-gray-700 px-4">
      <h1 class="font-bold">Utviklet av</h1>
      <p>Nettsiden er utviklet og vedlikeholdt av:</p>
      <p>Marius Arhaug</p>
      <p>
        <a class="anchor-hover" href="https://www.github.com/MariusArhaug">Github</a> |
        <a class="anchor-hover" href="https://www.linkedin.com/in/marius-arhaug-9606321a8/"
          >Linkedin</a
        >
      </p>
    </div>
    <div></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'FooterContact',
})
</script>
