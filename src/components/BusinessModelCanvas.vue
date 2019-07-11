<template>
  <div class="grid-container">
    <div v-for="field in canvasFields" :key="field.key" :class="field.key" class="grid-item">
      <div class="grid-item-header">
        <div>{{field.label}}</div>
        <div style="cursor: pointer" >
          <img src="@/assets/img/insert-button.png" width="20"/>
        </div>
      </div>
      <div class="grid-item-body">
        <card />
      </div>
    </div>
  </div>
</template>

<script>

import Card from './Card'

export default {
  name: 'BusinessModelCanvas',
  components: {
    Card
  },
  data () {
    return {
      canvasFields: [
        { key: 'key-partners', label: 'Key Partners' },
        { key: 'key-activities', label: 'Key Activities' },
        { key: 'value-propositions', label: 'Value Propositions' },
        { key: 'customer-relationships', label: 'Customer Relationships' },
        { key: 'customer-segments', label: 'Customer Segments' },
        { key: 'key-resources', label: 'Key Resources' },
        { key: 'channels', label: 'Channels' },
        { key: 'cost-structure', label: 'Cost Structure' },
        { key: 'revenue-streams', label: 'Revenue Streams' }
      ]
    }
  }
}
</script>
<style lang="stylus" scoped>
.grid-container
  border 1px solid green
  height 100%
  display grid
  grid-template-areas \
    'key-partners key-partners key-activities key-activities value-propositions value-propositions customer-relationships customer-relationships customer-segments customer-segments'\
    'key-partners key-partners key-activities key-activities value-propositions value-propositions customer-relationships customer-relationships customer-segments customer-segments'\
    'key-partners key-partners key-resources key-resources value-propositions value-propositions channels channels customer-segments customer-segments'\
    'cost-structure cost-structure cost-structure cost-structure cost-structure revenue-streams revenue-streams revenue-streams revenue-streams revenue-streams'

.key-partners
  grid-area key-partners

.key-activities
  grid-area key-activities

.value-propositions
  grid-area value-propositions

.customer-relationships
  grid-area customer-relationships

.customer-segments
  grid-area customer-segments

.key-resources
  grid-area key-resources

.channels
  grid-area channels

.cost-structure
  grid-area cost-structure

.revenue-streams
  grid-area revenue-streams

.grid-item
  text-align center
  border 1px solid black
  &-header
    display flex
    align-items center
    justify-content space-between
    padding 1rem
    font-size 1.3rem
  &-body
    padding 0 1rem
</style>
