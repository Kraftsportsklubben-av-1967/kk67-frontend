<template>
    <div>
        <div id="background">
            <div :id="`points-${calcId}`">
                <h2 :id="`display-glp-${calcId}`"></h2>
                <h3 :id="`display-dots-${calcId}`"></h3>
            </div>
        </div>

        <div id="form-card">
            <div id="inner-form">
                <div class="field">
                <label for="total" class="label-number">Total</label>
                <input type="number" :id="`total-${calcId}`" :name="`total-${calcId}`" min="0" step="2.5" @input="calc()">
                </div>

                <div class="field">
                <label for="bodyweight" class="label-number">Bodyweight</label>
                <input type="number" :id="`bodyweight-${calcId}`" :name="`bodyweight-${calcId}`" min="0" step="0.1" @input="calc()">
                </div>

                <div class="radio-group">
                <div class="radio-field">
                    <input type="radio" :id="`kilograms-${calcId}`" :name="`units-${calcId}`" value="kg" @change="calc()" checked>
                    <label for="kilograms" class="label-radio">Kilos</label>
                </div>
                <div class="radio-field">
                    <input type="radio" :id="`pounds-${calcId}`" :name="`units-${calcId}`" value="lbs" @change="calc()">
                    <label for="pounds" class="label-radio">Pounds</label>
                </div>
                </div>

                <div class="radio-group">
                <div class="radio-field">
                    <input type="radio" :id="`men-${calcId}`" :name="`sex-${calcId}`" value="M" @change="calc()" checked>
                    <label for="men" class="label-radio">Men</label>
                </div>
                <div class="radio-field">
                    <input type="radio" :id="`women-${calcId}`" :name="`sex-${calcId}`" value="F" @change="calc()">
                    <label for="women" class="label-radio">Women</label>
                </div>
                </div>

                <div class="radio-group">
                <div class="radio-field">
                    <input type="radio" :id="`raw-${calcId}`" :name="`equipment-${calcId}`" value="Raw" @change="calc()" checked>
                    <label for="raw" class="label-radio">Raw</label>
                </div>
                <div class="radio-field">
                    <input type="radio" :id="`single--${calcId}`" :name="`equipment-${calcId}`" value="Single-ply" @change="calc()">
                    <label for="single" class="label-radio">Single-ply</label>
                </div>
                </div>

                <div class="radio-group last">
                <div class="radio-field">
                    <input type="radio" :id="`sbd-${calcId}`" :name="`event-${calcId}`" value="SBD" @change="calc()" checked>
                    <label for="sbd" class="label-radio">3-Lift</label>
                </div>
                <div class="radio-field">
                    <input type="radio" :id="`b-${calcId}`" :name="`event-${calcId}`" value="B" @change="calc()">
                    <label for="b" class="label-radio">Bench</label>
                </div>
                </div>

                <input type="button" value="Calculate" :id="`calculate-${calcId}`" class="calculate" @click="calc()">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-v3-or-Later
let CALC_COUNTER = 0;

import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Calc',
    data() {
        return {
            calcId: ++CALC_COUNTER, // Increment counter and assign ID
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
            }
        }
    },
    methods: {
        calc() {
            const units = this.getRadioValue(`units-${this.calcId}`)!;
            const sex = this.getRadioValue(`sex-${this.calcId}`)!;
            const equipment = this.getRadioValue(`equipment-${this.calcId}`);
            const event = this.getRadioValue(`event-${this.calcId}`);
            let bw = Number((document.getElementById(`bodyweight-${this.calcId}`) as HTMLInputElement).value);
            let total = Number((document.getElementById(`total-${this.calcId}`) as HTMLInputElement).value);

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

            document.getElementById(`display-glp-${this.calcId}`)!.innerHTML = glp.toFixed(2);
            document.getElementById(`display-dots-${this.calcId}`)!.innerHTML = dots.toFixed(2) + " Dots";
        }, 
        getRadioValue(name) {
            const radios = document.getElementsByName(name) as NodeListOf<HTMLInputElement>;
            for (let i = 0; i < radios.length; ++i) {
                if (radios[i].checked) { return radios[i].value; }
            }
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
    height: 280px;
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
    font-size: 82px;
    font-weight: 700;
    line-height: 82px;
    text-align: center;
    margin-bottom: 10px;
}

h3 {
    font-size: 32px;
    font-weight: 400;
    line-height: 32px;
    text-align: center;
    margin-top: 12px;
    margin-bottom: 10px;
}
#form-card {
    display: block;
    max-width: 326px;
    margin-top: -70px;
    margin-right: auto;
    margin-left: auto;
    padding: 27px 40px 15px 40px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 43px 0 hsla(0, 0%, 64%, .45);
}

#inner-form {
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
.radio-group.last {
    margin-bottom: -13px;
    border-bottom-width: 0px;
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
    vertical-align: middle;
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
#calculate:hover {
    box-shadow: 0 7px 10px 0 rgba(0, 0, 0, .2);
}

footer {
    display: block;
    margin: 40px auto 0px;
    padding-bottom: 30px;
    font-size: 12px;
    line-height: 27px;
    text-align: center;
}    
</style>