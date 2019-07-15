<template>
  <div class="grid-container">
    {{touchedFields}}
    <div
      v-for="(field, fieldIdx) in canvasFields"
      :key="field.key"
      :class="`grid-item ${field.key} ${field.key === targetDragField ? 'target' : ''}`"
      :field="field.key">
      <div class="grid-item-header noselect">
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

const debounce = (callback, wait) => {
  let timeout
  return (...args) => {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(context, args), wait)
  }
}

export default {
  name: 'BusinessModelCanvas',
  components: {
    Card,
    Draggable
  },
  props: {
    keyPartners: { type: Array, required: true },
    keyActivities: { type: Array, required: true },
    valuePropositions: { type: Array, required: true },
    customerRelationships: { type: Array, required: true },
    customerSegments: { type: Array, required: true },
    keyResources: { type: Array, required: true },
    channels: { type: Array, required: true },
    costStructure: { type: Array, required: true },
    revenueStreams: { type: Array, required: true }
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
      drag: false,
      targetDragField: '',
      touchedFields: {}
    }
  },
  computed: {
    canvasFields () {
      return [
        { key: 'key-partners', label: 'Key Partners', items: this.keyPartners },
        { key: 'key-activities', label: 'Key Activities', items: this.keyActivities },
        { key: 'value-propositions', label: 'Value Propositions', items: this.valuePropositions },
        { key: 'customer-relationships', label: 'Customer Relationships', items: this.customerRelationships },
        { key: 'customer-segments', label: 'Customer Segments', items: this.customerSegments },
        { key: 'key-resources', label: 'Key Resources', items: this.keyResources },
        { key: 'channels', label: 'Channels', items: this.channels },
        { key: 'cost-structure', label: 'Cost Structure', items: this.costStructure },
        { key: 'revenue-streams', label: 'Revenue Streams', items: this.revenueStreams }
      ]
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
      const canvasField = this.canvasFields[fieldIdx]
      const { items, key } = canvasField
      items[itemIndex] = content
      this.touchedFields = { ...this.touchedFields, [key]: true }
    },
    onCardDelete (fieldIdx, itemIdx) {
      const canvasField = this.canvasFields[fieldIdx]
      const { items, key } = canvasField
      const content = items[itemIdx]
      items.splice(itemIdx, 1)
      this.$emit('delete-item', { fieldKey: key, itemIdx, content })
    },
    requestUpdate: debounce(touchedFields => {
      console.log('UPDATING FIELDS', JSON.stringify(Object.keys(touchedFields)))
    }, 1000)
  },
  watch: {
    touchedFields (val) {
      this.requestUpdate(val)
    }
  }
}
</script>

<style lang="stylus">
.noselect
  -webkit-touch-callout none /* iOS Safari */
    -webkit-user-select none /* Safari */
     -khtml-user-select none /* Konqueror HTML */
       -moz-user-select none /* Firefox */
        -ms-user-select none /* Internet Explorer/Edge */
            user-select none /* Non-prefixed version, currently supported by Chrome and Opera */
</style>

<style lang="stylus" scoped>
$grey-100 = #f5f5f5
$grey-200 = #eeeeee
$grey-300 = #E0E0E0
$grey-500 = #9E9E9E
$grey-600 = #757575
$grey-700 = #616161
$grey-800 = #424242

$green-100 = #C8E6C9

$border-color = $grey-500
$border-width = 1px

.grid-container
  box-sizing border-box
  min-height 100%
  border-bottom $border-width solid $border-color
  border-left $border-width solid $border-color
  display grid
  // 10 columns, min width: 100px
  grid-template-columns repeat(10, minmax(100px, 1fr))
  grid-auto-rows minmax(min-content, auto)
  color $grey-700
  background $grey-200

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
</style>
