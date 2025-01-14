<template>
<div class="md:w-5/6 md:mx-auto mx-8">
        <div class="lg:flex lg:justify-between">
            <div class="header-red-underline">Regn ut poeng</div>
            <div class="flex lg:items-center mt-10 lg:mt-0">
                <button @click="addCalc" class="half-circle-btn">+</button>
                <button @click="removeCalc" class="half-circle-btn">-</button>
            </div>
        </div>
        <div class="lg:flex lg:mt-12 lg:justify-evenly flex-wrap mt-4 gap-2 gap-y-16">
            <Calc class="mt-10 lg:mt-0" v-for='i in n' :index="i" :key="i"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Calc from './Calc.vue'

const MIN_CALCS = 2

export default defineComponent({
    name: 'Points',
    components: {
        Calc,
    },
    data() {
        return {
            n: 2,
        }
    },
    methods: {
        addCalc() {
            this.n++
        },
        removeCalc() {
            if (this.n > MIN_CALCS) {
                this.n--
            }
        },
    },
  })


</script>
<style scoped>
.half-circle-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: large;
    background-color: black;
    color: white;
    font-weight: bold;
}

.half-circle-btn:hover {
    @apply bg-red-700;
    transition-duration: 0.4s;
}

.half-circle-btn:first-child {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
}
.half-circle-btn:last-child {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
}


</style>
