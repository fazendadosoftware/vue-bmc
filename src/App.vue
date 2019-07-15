<template>
  <div id="app">
    <bmc
      :key-partners="keyPartners"
      :key-activities="keyActivities"
      :value-propositions="valuePropositions"
      :customer-relationships="customerRelationships"
      :customer-segments="customerSegments"
      :key-resources="keyResources"
      :channels="channels"
      :cost-structure="costStructure"
      :revenue-streams="revenueStreams"
      @delete-item="itemDeleteHandler"
      @update="updateHandler"
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
      valuePropositions: ['some value proposition'],
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
    },
    updateHandler (updatedFieldKeys) {
      console.log('PARENT UPDATE', updatedFieldKeys)
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
