<template>
  <div class="grid-container">
    <div
      v-for="(field, fieldIdx) in canvasFields"
      :key="field.key"
      :class="`grid-item ${field.key} ${field.key === targetDragField ? 'target' : ''}`"
      :field="field.key">
      <div class="grid-item-header">
        <div>{{field.label}}</div>
       <font-awesome-icon @click="addCard(field.key)" icon="plus" style="cursor:pointer; padding:0.5rem"/>
      </div>
      <draggable
        tag="div"
        class="dropzone"
        :class="`${field.key} ${field.key === targetDragField ? 'target' : ''}`"
        :list="field.items"
        :move="onDragMove"
        v-bind="dragOptions"
        @start="onDragStart"
        @end="onDragEnd"
        @change="onChange"
        :ref="field.key">
        <card
          v-for="(item, idx) in field.items"
          :key="idx"
          :content="item"
          @delete="onCardDelete(fieldIdx, idx)"
          @changed="onCardContentChanged(fieldIdx, idx, $event)"/>
      </draggable>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Card from './Card'
import Draggable from 'vuedraggable'
import VueCloseable from '../directives/vue-closeable'
import 'vue-draggable/polyfills'
import VueMarkdown from 'vue-markdown'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faPen, faSlash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

[faPlus, faPen, faTrashAlt, faSlash].forEach(icon => library.add(icon))

Vue.component('vue-markdown', VueMarkdown)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('vue-markdown', VueMarkdown)

Vue.use(VueCloseable)

export default {
  name: 'BusinessModelCanvas',
  components: {
    Card,
    Draggable
  },
  data () {
    return {
      dragOptions: {
        group: 'bmc',
        sort: false,
        delay: 0,
        disabled: false,
        animation: 150,
        ghostClass: 'ghost', // Class name for the drop placeholder
        chosenClass: 'chosen', // Class name for the chosen item
        dragClass: 'drag', // Class name for the dragging item,
        forceFallback: false,
        handle: '.card-container[not-editing]'
      },
      canvasFields: [
        { key: 'key-partners', label: 'Key Partners', items: [] },
        { key: 'key-activities', label: 'Key Activities', items: [] },
        { key: 'value-propositions', label: 'Value Propositions', items: [] },
        { key: 'customer-relationships', label: 'Customer Relationships', items: [] },
        { key: 'customer-segments', label: 'Customer Segments', items: [] },
        { key: 'key-resources', label: 'Key Resources', items: [] },
        { key: 'channels', label: 'Channels', items: [] },
        { key: 'cost-structure', label: 'Cost Structure', items: [] },
        { key: 'revenue-streams', label: 'Revenue Streams', items: [] }
      ],
      drag: false,
      targetDragField: ''
    }
  },
  methods: {
    onDragStart (evt) {
      this.drag = true
    },
    onDragEnd (evt) {
      this.drag = false
      this.targetDragField = ''
    },
    // Called when dragging element changes position
    onChange (e) {
      console.log(`%cGroup Change:`, 'background: green; color: white', e)
      console.log('FIELDS', this.canvasFields)
    },
    onDragMove (evt) {
      const { to } = evt
      const targetField = to.className.split(' ').filter(cl => cl !== 'dropzone').shift()
      if (targetField !== this.targetDragField) this.targetDragField = targetField
    },
    addCard (field) {
      const fieldIdx = this.canvasFields.map(field => field.key).indexOf(field)
      if (fieldIdx < 0) {
        console.warn(`Field ${field} unknown`)
        return
      }
      this.canvasFields[fieldIdx].items.push('')
      this.$nextTick(() => {
        const fieldKey = this.canvasFields[fieldIdx].key
        const cards = this.$refs[fieldKey][0].$children
        const recentlyAddedCard = cards[cards.length - 1]
        setTimeout(() => { recentlyAddedCard.editing = true }, 50)
      })
      console.log(`${new Date().toISOString()} adding card ${field}`)
    },
    onCardContentChanged (fieldIdx, itemIndex, content) {
      this.canvasFields[fieldIdx].items[itemIndex] = content
    },
    onCardDelete (fieldIdx, itemIdx) {
      this.canvasFields[fieldIdx].items.splice(itemIdx, 1)
    }
  }
}
</script>
<style lang="stylus" scoped>
$border-color = black
$border-width = 1px
$grey-200 = #eeeeee
$grey-300 = #E0E0E0

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
  display flex
  flex-flow column
  transition background-color 0.2s ease
  border-top $border-width solid $border-color
  border-right $border-width solid $border-color
  background $grey-200
  &.target
    background $grey-300
  &-header
    display flex
    align-items center
    justify-content space-between
    padding 1rem
    font-size 1.3rem
    font-weight bold

  .dropzone
    flex 1
    display flex
    flex-flow column
    align-items center
    justify-content flex-start
    & > .card-container
      min-width 150px
      max-width 300px
      width calc(100% - 2rem)
      min-height 80px
      margin-bottom 1rem
    &.cost-structure, &.revenue-streams
      display flex
      flex-flow row wrap
      justify-content center
      align-items flex-start
      padding 1rem
      & > .card-container
        width 30%
        margin-right 1rem

  // class for the drop placeholder
  .ghost
    opacity 0
  // class for the chosen item (applied when user click on draggable element)
  /*
  .chosen
    transform rotate(3deg)
    -moz-transform rotate(3deg)
    -webkit-transform rotate(3deg)
  */
  // class for the dragging item (applied when user starts dragging the element)
  .drag
    transform rotate(3deg)
    -moz-transform rotate(3deg)
    -webkit-transform rotate(3deg)
    opacity 1

  .shadow-1
  box-shadow 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)

  .shadow-2
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)

  .shadow-3
    box-shadow 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)

</style>
