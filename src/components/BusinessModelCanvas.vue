<template>
  <div class="outer-container">
    <div class="inner-container">
      <slot name="header"/>
      <div class="grid-container">
        <div
          v-for="(field, fieldIdx) in canvasFields"
          :key="field.key"
          :class="`grid-item ${field.key} ${field.key === targetDragField ? 'target' : ''}`"
          :field="field.key">
          <div class="grid-item-header noselect">
            <div>{{field.label}}</div>
          <font-awesome-icon @click="addCard(field.key)" size="xs" icon="plus" style="cursor:pointer"/>
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
              :allow-colors="allowColors"
              @delete="onCardDelete(fieldIdx, idx)"
              @changed="onCardContentChanged(fieldIdx, idx, $event)"/>
          </draggable>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Vue from 'vue'
import Card from './Card'
import Draggable from 'vuedraggable'
import 'vue-draggable/polyfills'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faPen, faSlash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

[faPlus, faPen, faTrashAlt, faSlash].forEach(icon => library.add(icon))

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)

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
    updateDelay: { type: Number, required: false, default: 0 },
    keyPartners: { type: Array, required: true },
    keyActivities: { type: Array, required: true },
    valuePropositions: { type: Array, required: true },
    customerRelationships: { type: Array, required: true },
    customerSegments: { type: Array, required: true },
    keyResources: { type: Array, required: true },
    channels: { type: Array, required: true },
    costStructure: { type: Array, required: true },
    revenueStreams: { type: Array, required: true },
    locale: { type: String, required: false, default: 'en' },
    allowColors: { type: Boolean, required: false, default: false }
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
      touchedFields: {},
      translations: {
        en: {
          'key-partners': 'Key Partners',
          'key-activities': 'Key Activities',
          'value-propositions': 'Value Propositions',
          'customer-relationships': 'Customer Relationships',
          'customer-segments': 'Customer Segments',
          'key-resources': 'Key Resources',
          'channels': 'Channels',
          'cost-structure': 'Cost Structure',
          'revenue-streams': 'Revenue Streams'
        },
        de: {
          'key-partners': 'Schlüsselpartner',
          'key-activities': 'Schlüsselaktivitäten',
          'value-propositions': 'Wertangebote',
          'customer-relationships': 'Kundenbeziehungen',
          'customer-segments': 'Kundensegmente',
          'key-resources': 'Schlüsselressourcen',
          'channels': 'Kanäle',
          'cost-structure': 'Kostenstructur',
          'revenue-streams': 'Einnahmequellen'
        },
        pt: {
          'key-partners': 'Parceiros Chave',
          'key-activities': 'Atividades Chave',
          'value-propositions': 'Propostas de Valor',
          'customer-relationships': 'Relacionamento com Clientes',
          'customer-segments': 'Segmentos de Mercado',
          'key-resources': 'Recursos Chave',
          'channels': 'Canais',
          'cost-structure': 'Estrutura de Custos',
          'revenue-streams': 'Fontes de Renda'
        }
      }
    }
  },
  computed: {
    canvasFields () {
      const canvasFields = [
        { key: 'key-partners', items: this.keyPartners },
        { key: 'key-activities', items: this.keyActivities },
        { key: 'value-propositions', items: this.valuePropositions },
        { key: 'customer-relationships', items: this.customerRelationships },
        { key: 'customer-segments', items: this.customerSegments },
        { key: 'key-resources', items: this.keyResources },
        { key: 'channels', items: this.channels },
        { key: 'cost-structure', items: this.costStructure },
        { key: 'revenue-streams', items: this.revenueStreams }
      ].map(item => { return { ...item, label: this.translate(item.key) } })
      return canvasFields
    }
  },
  methods: {
    translate (key) {
      return this.translations[this.locale]
        ? this.translations[this.locale][key]
        : this.translations['en'][key]
    },
    onDragStart (evt) {
      this.drag = true
    },
    onDragEnd (evt) {
      const { to, from } = evt
      const sourceField = from.className.split(' ').filter(cl => cl !== 'dropzone').shift()
      const targetField = to.className.split(' ').filter(cl => cl !== 'dropzone').shift()
      this.drag = false
      this.targetDragField = ''
      this.touchedFields = { ...this.touchedFields, [sourceField]: true, [targetField]: true }
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
    },
    onCardContentChanged (fieldIdx, itemIndex, content) {
      const canvasField = this.canvasFields[fieldIdx]
      const { items, key } = canvasField
      items.splice(itemIndex, 1, content)
      this.touchedFields = { ...this.touchedFields, [key]: true }
    },
    onCardDelete (fieldIdx, itemIdx) {
      const canvasField = this.canvasFields[fieldIdx]
      const { items, key } = canvasField
      items.splice(itemIdx, 1)
      this.touchedFields = { ...this.touchedFields, [key]: true }
    },
    setRequestUpdate (updateDelay = 1000) {
      this.requestUpdate = debounce(ctx => {
        let { touchedFields } = ctx
        const fieldKeys = Object.keys(touchedFields).sort()
        if (!fieldKeys.length) return
        ctx.$emit('update', fieldKeys)
        ctx.touchedFields = {}
      }, updateDelay)
    }
  },
  watch: {
    touchedFields (val) {
      const fieldKeys = Object.keys(val)
      if (!fieldKeys.length) return
      this.requestUpdate(this)
    },
    updateDelay: val => this.setRequestUpdate(val)
  },
  created () {
    this.setRequestUpdate(this.updateDelay)
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
$grey-400 = #BDBDBD
$grey-500 = #9E9E9E
$grey-600 = #757575
$grey-700 = #616161
$grey-800 = #424242

$green-100 = #C8E6C9

$border-color = $grey-400
$border-width = 2px

.outer-container
  height 100%

.inner-container
  height 100%
  display flex
  flex-flow column

.grid-container
  flex-grow 1
  box-sizing border-box
  border-bottom $border-width solid $border-color
  border-left $border-width solid $border-color
  display grid
  // 10 columns, min width: 100px
  grid-template-columns repeat(10, minmax(100px, 1fr))
  grid-auto-rows minmax(min-content, auto)
  color $grey-700

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
    background $grey-200
  &-header
    display flex
    align-items center
    justify-content space-between
    padding 1rem
    font-size 1.3rem
    font-weight bold
    color $grey-700

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
