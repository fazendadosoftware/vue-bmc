<template>
  <div id="app">
    <bmc />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld'
import bmc from './components/BusinessModelCanvas'

export default {
  name: 'app',
  components: {
    bmc
    // HelloWorld
  }
}
</script>
<style lang="stylus">

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  height calc(100vh - 1rem)
</style>
