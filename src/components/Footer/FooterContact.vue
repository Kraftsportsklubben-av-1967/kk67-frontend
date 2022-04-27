<template>
  <div class="md:h-20 text-sm flex sm:flex-row text-left flex-col justify-evenly mx-8 sm:pl-0 pl-2">
    <div class="my-5 lg:mx-auto font-thin text-gray-500">
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
    <div class="my-5 lg:mx-auto w-fit font-thin text-gray-500">
      <h1 class="font-bold">Utviklet av</h1>
      <p>Nettsiden er utviklet og vedlikeholdt av:</p>
      <p>Marius Arhaug</p>
      <p>
        <a class="anchor-hover" href="https://www.github.com/MariusArhaug" target="_blank"
          >Github</a
        >
        |
        <a
          class="anchor-hover"
          href="https://www.linkedin.com/in/marius-arhaug-9606321a8/"
          target="_blank"
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
