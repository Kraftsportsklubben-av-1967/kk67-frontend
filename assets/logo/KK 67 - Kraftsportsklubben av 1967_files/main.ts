import { createApp, reactive } from "/node_modules/.vite/vue.js?v=799c7654";
import App from "/src/App.vue";
import { router } from "/src/router/index.ts?t=1643558042494";
import "/src/index.css?t=1643558042494";
const store = {
  debug: true,
  state: reactive({})
};
const app = createApp({
  data() {
    return {
      store
    };
  },
  ...App
});
app.use(router);
app.mount("#app");

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sYXJzZW5nby1tb25zZW4vd2Vic2l0ZS9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVBcHAsIHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuaW1wb3J0IEFwcCBmcm9tICcuL0FwcC52dWUnXG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tICcuL3JvdXRlcidcbmltcG9ydCAnLi9pbmRleC5jc3MnXG5cbi8vICogR2xvYmFsIHN0YXRlXG5cbmNvbnN0IHN0b3JlID0ge1xuICBkZWJ1ZzogdHJ1ZSxcblxuICBzdGF0ZTogcmVhY3RpdmUoe30pLFxufVxuXG4vLyAqIFJvb3QgY29tcG9uZW50LCB1bmZvbGQgQXBwIGNvbXBvbmVudCBpbnRvIGl0LlxuY29uc3QgYXBwID0gY3JlYXRlQXBwKHtcbiAgZGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RvcmU6IHN0b3JlLFxuICAgIH1cbiAgfSxcbiAgLi4uQXBwLFxufSlcblxuYXBwLnVzZShyb3V0ZXIpXG5hcHAubW91bnQoJyNhcHAnKVxuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUlBLE1BQU0sUUFBUTtBQUFBLEVBQ1osT0FBTztBQUFBLEVBRVAsT0FBTyxTQUFTO0FBQUE7QUFJbEIsTUFBTSxNQUFNLFVBQVU7QUFBQSxFQUNwQixPQUFPO0FBQ0wsV0FBTztBQUFBLE1BQ0w7QUFBQTtBQUFBO0FBQUEsS0FHRDtBQUFBO0FBR0wsSUFBSSxJQUFJO0FBQ1IsSUFBSSxNQUFNOyIsIm5hbWVzIjpbXX0=