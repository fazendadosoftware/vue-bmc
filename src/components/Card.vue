<template>
  <div class="card-container shadow-2">
    <div v-if="item.title" class="card-header">
      {{item.title}}
    </div>
    <div v-if="item.body || typeof item === 'string'" class="card-body">
      {{item.body || item}}
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
  }
}
</script>

<style lang="stylus" scoped>
  .card-container
    min-height 100px
    background white
</style>
