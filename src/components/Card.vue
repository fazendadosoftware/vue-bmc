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
        <font-awesome-icon v-if="editing" icon="trash-alt" @click="editing = false; $emit('delete')"/>
      </transition>
      <transition name="fade">
        <font-awesome-layers v-if="hover || editing" @click="editing = !editing">
          <font-awesome-icon icon="pen" />
          <transition name="fade">
            <font-awesome-icon v-if="editing" icon="slash" />
          </transition>
        </font-awesome-layers>
      </transition>
    </div>
    <div class="body">
      <vue-markdown v-if="!editing" :source="editedContent"/>
      <textarea
        v-show="editing"
        rows="1"
        v-model="editedContent"
        @keydown="autosize"
        ref="textarea"/>
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
    },
    autosize (evt) {
      const { target } = evt
      setTimeout(() => {
        target.style.cssText = 'height:100%;padding:0.5rem'
        target.style.cssText = `height: calc(${target.scrollHeight}px + 1rem)`
      }, 0)
    }
  },
  watch: {
    content (val) {
      this.editedContent = val
    },
    editedContent (val) {
      if (val !== this.content) this.$emit('changed', val)
    },
    editing (val, oldVal) {
      // if the user finalized the edition without content, remove that card...
      if (!val && oldVal && !this.editedContent) {
        this.$emit('delete')
        return
      }
      // if the user starts to edit the card, focus on the text area element
      if (val && !oldVal) this.$nextTick(() => { this.$refs.textarea.focus() })
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
    transition all .3s ease
    display flex
    flex-flow column
    padding 0.5rem
    background white
    position relative
    box-sizing border-box
    & > :not(.card-editing)
      cursor pointer
    & > .actions
      position absolute
      right 0
      bottom 0
      padding-bottom 0.5rem
      display flex
      align-items center
      > svg, .fa-layers
        padding 0.3rem
        cursor pointer
        border-radius 3px
        margin-right 0.5rem
        &:hover
          background $grey-200

  .body
    text-align left
    font-size 0.8rem
    width 100%
    height 100%

  textarea
    width 100%
    height 100%
    border none
    font-family inherit
    font-size 0.8rem
    line-height 120%
    outline none !important
    resize none
    box-sizing border-box
    border-radius 3px
    padding 12.8px 0

  .fade-enter-active, .fade-leave-active
    transition opacity .5s
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    opacity 0

</style>
