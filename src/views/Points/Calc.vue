<template>
    <div>
        <div id="background">
            <div class="text-center pt-4 font-bold">
                <input 
                    type="text" 
                    :placeholder="placeholder" 
                    @focus="clearPlaceholder"
                    @blur="resetPlaceholder"
                    class="text-center font-bold bg-inherit text-white placeholder:text-white text-xl placeholder:text-xl" />
            </div>
            <div class="-mt-4">
                <h2> {{ glp.toFixed(2) }}</h2>
                <h3> {{ dots.toFixed(2) }} Dots</h3>
            </div>
        </div>

        <div class="form-card">
            <div class="inner-form">
                <div class="field">
                    <label for="total" class="label-number">Total</label>
                    <input 
                        type="number" 
                        name="total"
                        min="0" 
                        step="2.5" 
                        @input="updateSelectedValue(inputOptions[0].id, ($event.target as HTMLInputElement).value)">
                </div>

                <div class="field">
                    <label for="bodyweight" class="label-number">Bodyweight</label>
                    <input 
                        type="number"
                        name="bodyweight" 
                        min="0" 
                        step="0.1"
                        @input="updateSelectedValue(inputOptions[1].id, ($event.target as HTMLInputElement).value)">

                </div>

                <div class="radio-group" v-for="(optionPair, i) in options" :key="i">
                    <div class="radio-field" v-for="(option, j) in optionPair" :key="j">
                        <input 
                            type="radio" 
                            :name="`${option.name}-${index}`" 
                            :value="option.value"
                            :checked="j === 0" 
                            :v-model="selectedValues[option.name]"
                            @change="updateSelectedValue(option.name, option.value)"
                            >
                        <label :for="option.id" class="label-radio">{{ option.label }}</label>
                    </div>
                </div>

                <input type="button" value="Calculate" class="calculate hover:p-2" @click="calc()">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-v3-or-Later

import { placeholder } from '@babel/types';
import { clear } from 'console';
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Calc',
    props: {
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            placeholder: `Lifter ${this.index}`,
            inputOptions: [
                { id: 'total',      value: '' },
                { id: 'bodyweight', value: '' },
            ],
            options: [
                [
                    { id: 'kilograms',  name: 'units', label: 'Kilos',  value: 'kg' },
                    { id: 'pounds',     name: 'units', label: 'Pounds', value: 'lbs' }
                ],
                [
                    { id: 'men',    name: 'sex', label: 'Men',   value: 'M' },
                    { id: 'women',  name: 'sex', label: 'Women', value: 'F' }
                ],
                [
                    { id: 'raw',    name: 'equipment', label: 'Raw',        value: 'Raw' },
                    { id: 'single', name: 'equipment', label: 'Single-ply', value: 'Single-ply' }
                ],
                [
                    { id: 'sbd',    name: 'event', label: '3-Lift', value: 'SBD' },
                    { id: 'b',      name: 'event', label: 'Bench',  value: 'B' }
                ]
            ],
            selectedValues: {} as { [key: string]: string },
            PARAMETERS: {
                "M": {
                    "Raw": {
                        "SBD": [1199.72839, 1025.18162, 0.009210],
                        "B": [320.98041, 281.40258, 0.01008]
                    },
                    "Single-ply": {
                        "SBD": [1236.25115, 1449.21864, 0.01644],
                        "B": [381.22073, 733.79378, 0.02398]
                    }
                },
                "F": {
                    "Raw": {
                        "SBD": [610.32796, 1045.59282, 0.03048],
                        "B": [142.40398, 442.52671, 0.04724]
                    },
                    "Single-ply": {
                        "SBD": [758.63878, 949.31382, 0.02435],
                        "B": [221.82209, 357.00377, 0.02937]
                    }
                }
            },
            glp: 0.00,
            dots: 0.00,
        }
    },
    mounted() {
        this.selectedValues = Object.fromEntries(
            this.inputOptions.map((p) => [p.id, p.value]))
        
        Object.assign(this.selectedValues, Object.fromEntries(
            this.options.map((p) => [p[0].name, p[0].value])));
    },
    methods: {
        clearPlaceholder() {
            this.placeholder = '';
        },
        resetPlaceholder() {
            this.placeholder = `Lifter ${this.index}`;
        },
        updateSelectedValue(index, value) {
            this.selectedValues[index] = value;
            this.calc()
        },
        calc() {
            const units = this.selectedValues.units;
            const sex = this.selectedValues.sex;
            const equipment = this.selectedValues.equipment;
            const event = this.selectedValues.event;
            let bw = Number(this.selectedValues.bodyweight);
            let total = Number(this.selectedValues.total);

            if (units === "lbs") {
                bw = bw / 2.20462262;
                total = total / 2.20462262;
            }

            const dots = total * ((sex === "M") ? this.dots_men(bw) : this.dots_women(bw));

            const params = this.PARAMETERS[sex][equipment][event];
            const denom = params[0] - (params[1] * Math.exp(-1.0 * params[2] * bw))
            let glp = (denom === 0) ? 0 : Math.max(0, total * 100.0 / denom)
            if (isNaN(glp) || bw < 35) {
                glp = 0;
            }

            this.glp = glp;
            this.dots = dots;
        }, 
        dots_poly(a,b,c,d,e,x) {
            const x2=x*x
            const x3=x2*x
            const x4=x3*x
            return 500.0 / (a*x4+b*x3+c*x2+d*x+e);
        },
        dots_men(bw) {
            bw = Math.min(Math.max(bw, 40.0), 210.0);
            return this.dots_poly(-0.0000010930,0.0007391293,-0.1918759221,24.0900756,-307.75076,bw);
        },
        dots_women(bw) {
            bw = Math.min(Math.max(bw, 40.0), 150.0);
            return this.dots_poly(-0.0000010706,0.0005158568,-0.1126655495,13.6175032,-57.96288,bw);
      }
    }
  })
 // @license-end
</script>
  
<style scoped>
 * {
    box-sizing: border-box;
}
      
#background {
    height: 300px;
    color: #fff;
    background-image: linear-gradient(to right, #f8db70, #f83707);
}
#title {
    height: 38px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom-style: solid;
    background-color: #fff;
    color: #fff;
}
h1 {
    color: #e96809;
    font-size: 16px;
    line-height: 16px;
    margin: 0px auto;
}
h2 {
    padding-top: 2rem;
    font-size: 72px;
    font-weight: 700;
    line-height: 82px;
    text-align: center;
    margin-bottom: 10px;
}

h3 {
    font-size: 27px;
    font-weight: 400;
    line-height: 32px;
    text-align: center;
    margin-top: 12px;
    margin-bottom: 10px;
}
.form-card {
    display: block;
    margin-top: -70px;
    padding: 27px 40px 15px 40px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 43px 0 hsla(0, 0%, 64%, .45);
}

.inner-form {
    margin: 0 0 15px;
}

.field {
    display: flex;
    justify-content: space-between;
}
label {
    font-weight: 400;
    font-size: 18px;
}

.radio-group {
    display: flex;
    padding-top: 15px;
    padding-bottom: 11px;
    border-bottom: 1px solid #cdcdcd;
}


.radio-field {
    display: block;
    margin-bottom: 5px;
    padding-left: 20px;
}

.label-radio {
    min-width: 70px;
    margin-right: 20px;
    display: inline-block;
    cursor: pointer;
    margin-bottom: 0;
}

input[type="radio"] {
    margin: 4px 0 0;
    line-height: normal;
    float: left;
    margin-left: -20px;
    margin-top: 3px;
    padding: 0;
    cursor: pointer;
}

.label-number {
    display: block;
    padding-top: 6px;
    padding-right: 25px;
    margin-bottom: 5px;
}

input[type="number"] {
    width: 110px;
    display: block;
    padding: 8px 12px;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #333333;
    background-color: #fff;
    border: 1px solid #cdcdcd;
    border-radius: 5px;
}

input[type="number"]:focus {
    border-color: gold;
}

.calculate {
    width: 247px;
    height: 50px;
    margin-top: 30px;
    border-radius: 30px;
    background-image: -webkit-gradient(linear, left top, right top, from(#fe685e), to(#dc372d));
    background-image: linear-gradient(90deg, #fe685e, #dc372d);
    font-weight: 400;
    letter-spacing: 1px;
    text-transform: uppercase;
    display: inline-block;
    padding: 9px 15px;
    color: #fff;
    border: 0;
    font-size: 18px;
    font-family: Montserrat, sans-serif;
    text-decoration: none;
    cursor: pointer;
}

</style>