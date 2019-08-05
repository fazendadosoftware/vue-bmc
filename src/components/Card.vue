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
      <transition name="fade">
        <div v-if="editing" class="palette">COLOR PALETTE</div>
      </transition>
      <div style="flex: 1"/>
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
    content: [String, Object]
  },
  data () {
    return {
      editing: false,
      hover: false,
      editedContent: ''
    }
  },
  computed: {
    cardText () {
      return typeof this.content === 'string'
        ? this.content
        : typeof this.content === 'object'
          ? this.content.text
          : 'invalid content type'
    },
    style () {
      const { background = '#FFF9C4', color = '#2f363d' } = typeof this.content === 'object' ? this.content : {}
      return `background: ${background}; color: ${color}`
    }
  },
  methods: {
    updateEditedContentFromProp () {
      this.editedContent = this.cardText
    },
    onClose () {
      if (this.editing) this.editing = false
    },
    autosize (evt) {
      const { target } = evt
      setTimeout(() => {
        target.style.cssText = 'height:100%;padding:0.5rem'
        target.style.cssText = `height: calc(${target.scrollHeight}px + 1rem); ${this.style}`
      }, 0)
    }
  },
  watch: {
    text (val) {
      this.editedContent = val
    },
    editedContent (val) {
      if (val !== this.cardText) this.$emit('changed', val)
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
    }
  },
  created () {
    this.editedContent = this.cardText
  }
}
</script>

<style lang="stylus" scoped>
  $grey-100 = #f5f5f5
  $grey-200 = #eeeeee

  $yellow-100 = #FFF9C4

  $border-radius = 2px

  .card-container
    transition all .3s ease
    display flex
    flex-flow column
    padding 0.5rem
    position relative
    box-sizing border-box
    border-radius $border-radius
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
        padding 0.3rem
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

</style>
