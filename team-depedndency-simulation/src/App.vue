<template>
  <div id="app">
    <State />
    <Results />
  </div>
</template>

<script>
import State from './components/State.vue'
import Results from './components/Results.vue'

export default {
  name: 'App',
  components: {
    State,
    Results
  },
  data() {
    return {
      state: {}
    }
  }
}
</script>
