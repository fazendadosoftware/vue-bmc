<template>
  <div
    class="card-container shadow-2"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    v-closable="{
      exclude: ['div.card-container'],
      handler: 'onClose'
    }">
    <div class="card-header">
      <div class="title">
        <span v-if="!editing">{{title}}</span>
        <input v-if="editing && typeof item === 'object'" v-model="title">
      </div>
      <div class="actions">
        <transition name="fade">
          <font-awesome-icon v-if="hover" icon="pen" @click="editing = !editing" />
        </transition>
      </div>
    </div>
    <div class="card-body">
      <span v-if="!editing">{{body}}</span>
      <input v-else v-model="body">
    </div>
  </div>
</template>

<script>

export class CardItem {
  constructor (title, body) {
    this.title = title
    this.body = body
  }
}

export default {
  name: 'Card',
  props: {
    item: {
      type: [String, CardItem],
      required: true
    }
  },
  data () {
    return {
      editing: false,
      hover: false,
      editedItem: {}
    }
  },
  computed: {
    title: {
      get () {
        return this.editedItem.title
      },
      set (title) {
        this.editedItem = { ...this.editedItem, title }
      }
    },
    body: {
      get () {
        return this.editedItem.body
      },
      set (val) {
        this.editedItem.body = val
      }
    }
  },
  methods: {
    updateEditedItemFromProp () {
      this.editedItem = this.item instanceof CardItem ? { ...this.item } : new CardItem('', this.item)
    },
    onClose () {
      if (this.editing) this.editing = false
    }
  },
  watch: {
    item (val) {
      this.updateEditedItemFromProp()
    },
    editedItem (val) {
      console.log('edited item changed', val)
    }
  },
  created () {
    this.updateEditedItemFromProp()
  }
}
</script>

<style lang="stylus" scoped>
  $grey-200 = #eeeeee

  .card-container
    display flex
    flex-flow column
    padding 1rem
    background white
  .card-header
    display flex
    justify-content space-between
    align-items center
    > .title
      font-size 1rem
      font-weight bold
      margin-bottom 0.5rem
    > .actions
      min-height 28px
      > svg
        padding 0.3rem
        cursor pointer
        border-radius 3px
        &:hover
          background $grey-200

  .card-body
    display flex
    flex 1
    justify-content flex-start
    align-items center
    font-size 0.9rem

  .fade-enter-active, .fade-leave-active
    transition opacity .2s
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    opacity 0
</style>
