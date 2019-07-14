<template>
  <div
    class="card-container card-handle shadow-2"
    :class="editing ? 'card-editing' : ''"
    :style="editing ? 'padding-top: 35px' : ''"
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
    padding 0.5rem
    background white
    position relative
    box-sizing border-box
    & > .actions
      position absolute
      right 0
      top 0
      padding 0.5rem
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
    font-size inherit
    outline none !important
    resize none
    background $grey-200
    box-sizing border-box
    border-radius 3px
    padding 0.5rem
</style>
