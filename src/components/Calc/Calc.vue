<template>
  <Card>
    <template v-slot:header><h1></h1> </template>
    <template v-slot:body>
      <div>
        <div></div>
        <div class="field" v-for="field in fields">
          <label :for="field.label" class="label-number">{{ field.labelHTML }}</label>
          <input
            :type="field.type"
            :class="field.class"
            :name="field.name"
            :min="field.min"
            :step="field.step"
            :oninput="calc(0)"
          />
        </div>
      </div>
      <div class="radio-group">
        <div class="radio-field">
          <input type="radio" id="kilograms" name="units_0" value="kg" onchange="calc(0)" checked />
          <label for="kilograms" class="label-radio">Kilos</label>
        </div>
        <div class="radio-field">
          <input type="radio" id="pounds" name="units_0" value="lbs" onchange="calc(0)" />
          <label for="pounds" class="label-radio">Pounds</label>
        </div>
      </div>

      <div class="radio-group">
        <div class="radio-field">
          <input type="radio" id="men" name="sex_0" value="M" onchange="calc(0)" checked />
          <label for="men" class="label-radio">Men</label>
        </div>
        <div class="radio-field">
          <input type="radio" id="women" name="sex_0" value="F" onchange="calc(0)" />
          <label for="women" class="label-radio">Women</label>
        </div>
      </div>

      <div class="radio-group">
        <div class="radio-field">
          <input type="radio" id="raw" name="equipment_0" value="Raw" onchange="calc(0)" checked />
          <label for="raw" class="label-radio">Raw</label>
        </div>
        <div class="radio-field">
          <input
            type="radio"
            id="single"
            name="equipment_0"
            value="Single-ply"
            onchange="calc(0)"
          />
          <label for="single" class="label-radio">Single-ply</label>
        </div>
      </div>

      <div class="radio-group last">
        <div class="radio-field">
          <input type="radio" id="sbd" name="event_0" value="SBD" onchange="calc(0)" checked />
          <label for="sbd" class="label-radio">3-Lift</label>
        </div>
        <div class="radio-field">
          <input type="radio" id="b" name="event_0" value="B" onchange="calc(0)" />
          <label for="b" class="label-radio">Bench</label>
        </div>
      </div>
      <input type="button" value="Calculate" id="calculate" onclick="calc(0)" />
    </template>
  </Card>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Card from '@components/Card/Card.vue'

export default defineComponent({
  name: 'CalculatePoints',
  components: { Card },

  data() {
    return {
      fields: [
        {
          labelHTML: 'Total',
          label: 'total',
          type: 'number',
          class: 'total',
          name: 'total_0',
          min: 0,
          step: '2.5',
        },
        {
          labelHTML: 'Bodyweight',
          label: 'bodyweight',
          type: 'number',
          class: 'bodyweight',
          name: 'bodyweight_0',
          min: 0,
          step: '0.1',
        },
      ],

      PARAMETERS: {
        M: {
          Raw: {
            SBD: [1199.72839, 1025.18162, 0.00921],
            B: [320.98041, 281.40258, 0.01008],
          },
          'Single-ply': {
            SBD: [1236.25115, 1449.21864, 0.01644],
            B: [381.22073, 733.79378, 0.02398],
          },
        },
        F: {
          Raw: {
            SBD: [610.32796, 1045.59282, 0.03048],
            B: [142.40398, 442.52671, 0.04724],
          },
          'Single-ply': {
            SBD: [758.63878, 949.31382, 0.02435],
            B: [221.82209, 357.00377, 0.02937],
          },
        },
      },
    }
  },
  methods: {
    calc(n: number) {},
  },
})

// function dots_poly(a, b, c, d, e, x) {
//   var x2 = x * x,
//     x3 = x2 * x,
//     x4 = x3 * x
//   return 500.0 / (a * x4 + b * x3 + c * x2 + d * x + e)
// }
// function dots_men(bw) {
//   bw = Math.min(Math.max(bw, 40.0), 210.0)
//   return dots_poly(-0.000001093, 0.0007391293, -0.1918759221, 24.0900756, -307.75076, bw)
// }
// function dots_women(bw) {
//   bw = Math.min(Math.max(bw, 40.0), 150.0)
//   return dots_poly(-0.0000010706, 0.0005158568, -0.1126655495, 13.6175032, -57.96288, bw)
// }

// var PARAMETERS = {
//   M: {
//     Raw: {
//       SBD: [1199.72839, 1025.18162, 0.00921],
//       B: [320.98041, 281.40258, 0.01008],
//     },
//     'Single-ply': {
//       SBD: [1236.25115, 1449.21864, 0.01644],
//       B: [381.22073, 733.79378, 0.02398],
//     },
//   },
//   F: {
//     Raw: {
//       SBD: [610.32796, 1045.59282, 0.03048],
//       B: [142.40398, 442.52671, 0.04724],
//     },
//     'Single-ply': {
//       SBD: [758.63878, 949.31382, 0.02435],
//       B: [221.82209, 357.00377, 0.02937],
//     },
//   },
// }

// function getRadioValue(name) {
//   var radios = document.getElementsByName(name)
//   for (var i = 0; i < radios.length; ++i) {
//     if (radios[i].checked) {
//       return radios[i].value
//     }
//   }
// }

// function calc(index) {
//   var units = getRadioValue('units_' + index)
//   var sex = getRadioValue('sex_' + index)
//   var equipment = getRadioValue('equipment_' + index)
//   var event = getRadioValue('event_' + index)
//   var bw = Number(document.getElementsByClassName('bodyweight')[index].value)
//   var total = Number(document.getElementsByClassName('total')[index].value)

//   if (units === 'lbs') {
//     bw = bw / 2.20462262
//     total = total / 2.20462262
//   }

//   var dots = total * (sex === 'M' ? dots_men(bw) : dots_women(bw))

//   var params = PARAMETERS[sex][equipment][event]
//   var denom = params[0] - params[1] * Math.exp(-1.0 * params[2] * bw)
//   var glp = denom === 0 ? 0 : Math.max(0, (total * 100.0) / denom)
//   if (isNaN(glp) || bw < 35) {
//     glp = 0
//   }

//   document.getElementsByClassName('display-glp')[index].innerHTML = glp.toFixed(2)
//   document.getElementsByClassName('display-dots')[index].innerHTML = dots.toFixed(2) + ' Dots'
//}
</script>
<style>
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
input[type='radio'] {
  margin: 4px 0 0;
  line-height: normal;
  float: left;
  margin-left: -20px;
  margin-top: 3px;
  padding: 0;
  cursor: pointer;
}
input[type='number'] {
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
input[type='number']:focus {
  border-color: gold;
}
#calculate {
  width: 247px;
  height: 50px;
  margin-top: 30px;
  border-radius: 30px;
  background-image: -webkit-gradient(linear, left top, right top, from(#ff4336), to(#f31f14));
  background-image: linear-gradient(90deg, #fa483b, #dc372d);
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
  box-shadow: 0 7px 10px 0 rgba(0, 0, 0, 0.2);
}
</style>
