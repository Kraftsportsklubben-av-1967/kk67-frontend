<template>
  <Layout>
    <template v-slot:sidebar></template>
    <template v-slot:main>
      <div v-for="meet in meets">
        <h1>{{ meet.title }}</h1>
      </div>
    </template>
  </Layout>
</template>
<script lang="ts">
import Layout from '@/components/Layout.vue'
import { defineComponent } from 'vue'
import { fetchXML } from './fetchXML'
import { removeUndefinedFromArray } from '../../utils/removeUndefinedFromArray'

const UPCOMING_MEETS = 'http://styrkeloft.no/stevner/?page=ical&skipHeader=1&&k=13'
const PREVIOUS_MEETS = 'resultatservice_integrasjon/rss_protokoll.php?m=1&klubb_id=13'

interface IMeet {
  title: string
  description?: string
  link: string
  date: Date
}

export default defineComponent({
  name: 'Meets',
  components: {
    Layout,
  },
  async created() {
    // TODO : need something clever here...
    // fetch(UPCOMING_MEETS, {
    //   mode: 'no-cors',
    //   method: 'GET',
    // })
    //   .then((res) => res.blob())
    //   .then((blob) => console.log(blob))

    // TODO: refactor this pile of shit
    fetchXML(PREVIOUS_MEETS).then((data) => {
      console.log(data)
      const channelTag = data.querySelector('channel')
      if (channelTag) {
        const items = Array.from(channelTag.children).filter(
          (element) => element.nodeName === 'item',
        )
        console.log(items)
        const meets = removeUndefinedFromArray(
          items.map((item) => {
            const title = item.querySelector('title')
            const date = item.querySelector('pubDate')
            const description = item.querySelector('description')
            const link = item.querySelector('link')

            if (!title || !date || !description || !link) {
              return undefined
            }
            return {
              title: title.innerHTML,
              date: new Date(date.innerHTML),
              link: link.innerHTML,
              description: description.innerHTML,
            } as IMeet
          }),
        )
        this.meets = meets
      }
    })
  },
  data() {
    return {
      meets: [] as IMeet[],
    }
  },
})
</script>
