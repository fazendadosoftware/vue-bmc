<template>
  <div
    class="card-container card-handle shadow-1"
    :class="editing ? 'card-editing' : ''"
    :style="style"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @dblclick="editing = true"
    @keyup.stop=""
    :not-editing="!editing"
    v-closable="{
      exclude: ['div.card-container'],
      handler: 'onClose'
    }">
    <div class="actions">
      <div v-if="editing && allowColors" class="palette">
        <div
          v-for="(option, idx) in cardColors"
          :key="idx" class="color-card"
          :style="`background:${option.background};color:${option.color}; border: 1px solid ${option.color}`"
          @click="colorSelectedEvtHandler(option)"/>
      </div>
      <div style="flex: 1"/>
      <font-awesome-icon v-if="editing" icon="trash-alt" @click="editing = false; $emit('delete')"/>
      <font-awesome-layers v-if="hover || editing" @click="editing = !editing">
        <font-awesome-icon icon="pen" />
          <font-awesome-icon v-if="editing" icon="slash" />
      </font-awesome-layers>
    </div>
    <div class="body">
      <vue-markdown class="noselect" v-if="!editing" :source="editedContent"/>
      <textarea
        v-show="editing"
        rows="1"
        v-model="editedContent"
        @keydown="autosize"
        :style="style"
        ref="textarea"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueMarkdown from 'vue-markdown'
import VueCloseable from '../directives/vue-closeable'

Vue.use(VueCloseable)

export default {
  name: 'Card',
  components: {
    VueMarkdown
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
          { background: '#fff59d', color: '#000000' }, // yellow-200
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
      background: '#fff59d'
    }
  },
  computed: {
    style () {
      return `background: ${this.background}; color: ${this.color}`
    }
  },
  methods: {
    onClose () {
      if (this.editing) this.editing = false
    },
    autosize (evt) {
      const { target } = evt
      setTimeout(() => {
        target.style.cssText = 'height:100%;padding:0.5rem'
        target.style.cssText = `height: calc(${target.scrollHeight}px + 1rem); ${this.style}`
      }, 0)
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
        return
      }
      // if the user starts to edit the card, focus on the text area element
      if (val && !oldVal) {
        this.$nextTick(() => {
          const target = this.$refs.textarea
          this.autosize({ target })
          this.$refs.textarea.focus()
        })
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
  }
}
</script>

<style lang="stylus" scoped>
  $grey-100 = #f5f5f5
  $grey-200 = #eeeeee

  $yellow-100 = #FFF9C4

  $border-radius = 2px

  .card-container
    display flex
    flex-flow column
    padding 0.5rem 1rem
    position relative
    box-sizing border-box
    border-radius $border-radius
    padding-bottom 30px
    & > :not(.card-editing)
      cursor pointer
    & > .actions
      position absolute
      right 0
      width 100%
      bottom 0.5rem
      display flex
      align-items center
      > svg, .fa-layers, .palette
        padding 0.5rem
        cursor pointer
        border-radius $border-radius
        margin-right 0.5rem

  .body
    text-align left
    font-size 0.8rem
    width 100%
    height 100%
    overflow-wrap break-word

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
    padding 12.8px 0
    overflow hidden

  .fade-enter-active, .fade-leave-active
    transition opacity .5s
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

</style>
