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
$border-color = black
$border-width = 1px

.grid-container
  height 100%
  border-bottom $border-width solid $border-color
  border-left $border-width solid $border-color
  display grid
  // 10 columns, min width: 250px
  grid-template-columns repeat(10, minmax(100px, 1fr))
  grid-auto-rows minmax(100px, auto)

.key-partners
  grid-column 1 / 3
  grid-row 1 / 4

.key-activities
  grid-column 3 / 5
  grid-row 1 / 3

.value-propositions
  grid-column 5 / 7
  grid-row 1 / 4

.customer-relationships
  grid-column 7 / 9
  grid-row 1 / 3

.customer-segments
  grid-column 9 / 11
  grid-row 1 / 4

.key-resources
  grid-column 3 / 5
  grid-row 3 / 4

.channels
  grid-column 7 / 9
  grid-row 3

.cost-structure
  grid-column 1 / 6
  grid-row 4

.revenue-streams
  grid-column 6 / 11
  grid-row 4

.grid-item
  text-align center
  border-top $border-width solid $border-color
  border-right $border-width solid $border-color
  &-header
    display flex
    align-items center
    justify-content space-between
    padding 1rem
    font-size 1.3rem
  &-body
    padding 0 1rem
</style>
