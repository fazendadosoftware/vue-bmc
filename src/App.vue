<template>
  <div id="app">
    <bmc
      :keyPartners="keyPartners"
      :keyActivities="keyActivities"
      :valuePropositions="valuePropositions"
      :customerRelationships="customerRelationships"
      :customerSegments="customerSegments"
      :keyResources="keyResources"
      :channels="channels"
      :costStructure="costStructure"
      :revenueStreams="revenueStreams"
      @delete-item="itemDeleteHandler"
      />
  </div>
</template>

<script>
import bmc from './components/BusinessModelCanvas'

export default {
  name: 'app',
  components: {
    bmc
  },
  data () {
    return {
      keyPartners: ['key partner'],
      keyActivities: ['some activities', 'cucuia'],
      valuePropositions: [],
      customerRelationships: [],
      customerSegments: [],
      keyResources: [],
      channels: [],
      costStructure: [],
      revenueStreams: []
    }
  },
  methods: {
    itemDeleteHandler ({ fieldKey, itemIdx, content }) {
      console.log('DELETING', fieldKey, itemIdx, content)
    }
  }
}
</script>
<style lang="stylus">

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  height calc(100vh - 1rem)
</style>
