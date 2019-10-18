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
      :update-delay="updateDelay"
      :revenue-streams="revenueStreams"
      :locale="locale"
      @update="updateHandler"
      ref="bmc">
      <template v-slot:header>
        <h1>Business Model Canvas</h1>
      </template>
    </bmc>
  </div>
</template>

<script>
import { generatePowerPointFromExportContainer } from './helpers/pptxGenerator'
import bmc from './components/BusinessModelCanvas'

export default {
  name: 'app',
  components: {
    bmc
  },
  data () {
    return {
      keyPartners: [{ text: 'key Partner', background: '#4caf50', color: '#000000' }],
      keyActivities: ['some activities', 'cucuia'],
      valuePropositions: ['some value proposition'],
      customerRelationships: [],
      customerSegments: [],
      keyResources: [],
      channels: [],
      costStructure: [],
      revenueStreams: [],
      updateDelay: 100,
      locale: 'en'
    }
  },
  methods: {
    updateHandler (updatedFieldKeys) {
      // console.log('PARENT UPDATE', updatedFieldKeys)
    },
    exportToPPT () {
      generatePowerPointFromExportContainer(this.$refs.bmc.$el)
      console.log('EXPORTING TO PPT')
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
