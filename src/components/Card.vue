<template>
  <div class="card-container shadow-2">
    {{item}}
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: ['item']
}
</script>

<style lang="stylus" scoped>
  .card-container
    min-height 100px
    background white
</style>
