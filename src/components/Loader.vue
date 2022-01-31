<template>
  <div
    class="border-solid border-t-red-600 border-gray-200 rounded-full w-48 h-48 flex justify-center loader"
  />
</template>

<style scoped>
.loader {
  border-width: 7.5px;
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
