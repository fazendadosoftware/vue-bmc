<template>
  <div
    class="card-container card-handle shadow-1"
    :style="style"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="editing = true; $refs.contentBox ? $refs.contentBox.focus() : ''"
    :not-editing="!editing"
    @keyup.stop=""
    v-closable="{ exclude: ['div.card-container'], handler: 'onClose' }">
    <transition name="fade">
      <font-awesome-icon
        v-if="hover || editing"
        class="close-card-btn"
        icon="times-circle"
        @click="editing = false; $emit('delete')"/>
    </transition>
    <div class="body"
      contenteditable
      v-html="editedContent.replace(/\n/g, '<br />')"
      @blur="contentEditEvtHandler"
      ref="contentBox"/>
    </div>
</template>

<script>
import Vue from 'vue'
// import VueMarkdown from 'vue-markdown'
import VueCloseable from '../directives/vue-closeable'

Vue.use(VueCloseable)

export default {
  name: 'Card',
  components: {
    // VueMarkdown
  },
  props: {
    content: [String, Object],
    allowColors: {
      type: Boolean,
      required: false,
      default: true
    },
    cardColors: {
      type: Array,
      required: false,
      default () {
        return [
          { background: '#fff4b4', color: '#000000' },
          { background: '#f44336', color: '#000000' }, // red-500
          { background: '#4caf50', color: '#000000' }, // green-500
          { background: '#29b6f6', color: '#000000' } // lightblue-400
        ]
      }
    }
  },
  data () {
    return {
      editing: false,
      hover: false,
      editedContent: '',
      color: '#000000',
      background: '#fff4b4'
    }
  },
  computed: {
    style () {
      return `background: ${this.background}; color: ${this.color}`
    }
  },
  methods: {
    contentEditEvtHandler (evt) {
      const { innerText } = evt.target
      this.$emit('changed', innerText)
    },
    onClose () {
      if (this.editing) this.editing = false
    },
    colorSelectedEvtHandler (option) {
      const { background, color } = option
      this.background = background
      this.color = color
      const { text = this.content } = this.content
      this.$emit('changed', { text, background, color })
    }
  },
  watch: {
    editedContent (text) {
      this.$emit('changed', typeof this.content === 'string' ? text : { ...this.content, text })
    },
    editing (val, oldVal) {
      // if the user finalized the edition without content, remove that card...
      if (!val && oldVal && !this.editedContent) {
        this.$emit('delete')
      }
    },
    content (val) {
      if (typeof val === 'object') {
        const { background = '#fff59d', color = '#000000', text } = val
        this.background = background
        this.color = color
        this.editedContent = text
      } else {
        this.editedContent = val
      }
    }
  },
  created () {
    if (typeof this.content === 'object') {
      const { background = '#fff59d', color = '#000000', text } = this.content
      this.background = background
      this.color = color
      this.editedContent = text
    } else {
      this.editedContent = this.content
    }
  },
  mounted () {
    if (!this.editedContent && this.$refs.contentBox) this.$refs.contentBox.focus()
  }
}
</script>

<style lang="stylus">
  p
    margin 0
  textarea
    padding 0
</style>

<style lang="stylus" scoped>
  $grey-100 = #f5f5f5
  $grey-200 = #eeeeee
  $grey-700 = #616161

  $border-radius = 3px

  .card-container
    display flex
    flex-flow column
    padding 12px
    position relative
    box-sizing border-box
    border-radius $border-radius
    transition all 0.2s ease
    &[not-editing]
      cursor move

  .close-card-btn
    transition color 0.3s ease
    position absolute
    top 0
    right 0
    transform translate(50%, -50%)
    height 20px
    width 20px
    background white
    border-radius 50%
    border none
    color #7c7c7c
    cursor pointer
    &:hover
      color #333333

  .body
    text-align left
    font-size 11px
    width 100%
    height 100%
    overflow-wrap break-word
    outline none
    cursor text !important
    // https://stackoverflow.com/questions/23530231/contenteditable-true-height-issue-in-firefox
    [contenteditable='true']
      &:before
        content "\feff "

  .fade-enter-active, .fade-leave-active
    transition opacity .3s
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    opacity 0

  .shadow-1
    box-shadow 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)

  .shadow-2
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)

  .shadow-3
    box-shadow 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)

  .palette
    display flex
    & .color-card
      background red
      margin-right 0.4rem
      height 20px
      width 20px

  .actions
    color $grey-700

</style>
