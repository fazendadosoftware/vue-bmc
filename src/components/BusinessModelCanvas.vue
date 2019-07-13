<template>
  <div class="grid-container">
    <div v-for="field in canvasFields" :key="field.key" :class="field.key" class="grid-item">
      <div class="grid-item-header">
        <div>{{field.label}}</div>
        <div style="cursor: pointer" >
          <img src="@/assets/img/insert-button.png" width="20"/>
        </div>
      </div>
      <draggable
        tag="div"
        class="dropzone"
        :list="field.items"
        :group="{ name: 'row' }"
        v-bind="dragOptions"
        @change="onGroupChange">
        <card v-for="item in field.items" :key="item.id" :item="item"></card>
      </draggable>
    </div>
  </div>
</template>

<script>
import Card from './Card'
import Draggable from 'vuedraggable'

export default {
  name: 'BusinessModelCanvas',
  components: {
    Card,
    Draggable
  },
  data () {
    return {
      dragOptions: {
        animation: 150,
        disabled: false,
        ghostClass: 'ghost'
      },
      canvasFields: [
        { key: 'key-partners', label: 'Key Partners', items: [ { id: 'kp-1', name: 'Key Partner 1' } ] },
        { key: 'key-activities', label: 'Key Activities', items: [ { id: 'ka-1', name: 'Key Activity 1' } ] },
        { key: 'value-propositions', label: 'Value Propositions', items: [] },
        { key: 'customer-relationships', label: 'Customer Relationships', items: [] },
        { key: 'customer-segments', label: 'Customer Segments', items: [] },
        { key: 'key-resources', label: 'Key Resources', items: [] },
        { key: 'channels', label: 'Channels', items: [] },
        { key: 'cost-structure', label: 'Cost Structure', items: [] },
        { key: 'revenue-streams', label: 'Revenue Streams', items: [] }
      ]
    }
  },
  methods: {
    onGroupChange (e) {
      console.log(`%cGroup Change:`, 'background: green; color: white', e)
      console.log('FIELDS', this.canvasFields)
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
  // 10 columns, min width: 100px
  grid-template-columns repeat(10, minmax(100px, 1fr))
  grid-auto-rows minmax(min-content, auto)

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

  .dropzone
    min-height 100%

  .flip-list-move
    transition transform 0.5s

  .ghost
    opacity 0.5
    background #c8ebfb
</style>
