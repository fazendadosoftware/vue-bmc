<template>
  <div
    class="card-container card-handle shadow-2"
    :class="editing ? 'card-editing' : ''"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :not-editing="!editing"
    v-closable="{
      exclude: ['div.card-container'],
      handler: 'onClose'
    }">
    <div class="actions">
      <transition name="fade">
        <font-awesome-icon v-if="hover" icon="pen" @click="editing = !editing" />
      </transition>
    </div>
    <div class="body">
      <vue-markdown v-if="!editing" :source="editedContent"/>
      <textarea v-if="editing" v-model="editedContent"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Card',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      editing: false,
      hover: false,
      editedContent: ''
    }
  },
  methods: {
    updateEditedContentFromProp () {
      this.editedContent = this.content
    },
    onClose () {
      if (this.editing) this.editing = false
    }
  },
  watch: {
    content (val) {
      this.editedContent = val
    },
    editedContent (val) {
      console.log('edited content changed', val)
    }
  },
  created () {
    this.editedContent = this.content
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
    position relative
    box-sizing border-box
    & > .actions
      position absolute
      right 0
      top 0
      padding 0.5rem
      > svg
        float right
        padding 0.3rem
        cursor pointer
        border-radius 3px
        &:hover
          background $grey-200

  .body
    align-self flex-start
    font-size 0.8rem

  .fade-enter-active, .fade-leave-active
    transition opacity .2s
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    opacity 0
</style>
