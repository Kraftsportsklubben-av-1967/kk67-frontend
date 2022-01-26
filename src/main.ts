import { createApp, reactive } from 'vue'
import App from './App.vue'
import { router } from './router'
import './index.css'

// * Global state

const store = {
  debug: true,

  state: reactive({}),
}

// * Root component, unfold App component into it.
const app = createApp({
  data() {
    return {
      store: store,
    }
  },
  ...App,
})

app.use(router)
app.mount('#app')
