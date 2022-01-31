<template>
  <div
    class="border-solid border-t-red-600 border-gray-400 rounded-full w-96 h-96 flex justify-center"
    id="loader"
  ></div>
</template>

<style scoped>
#loader {
  border-width: 55px;
  animation: spin 1.5s linear infinite;
  margin: auto;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
