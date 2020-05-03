<template>
  <div class="results">
    <h2>Results
    <span v-if="state['complete']">(Complete)</span>
    <span v-if="!state['complete']">(Sprint {{state['sprint']}})</span>
    </h2>
    <div v-for="(status, strategy) in state['strategies']" :key="strategy" :class="strategy">
      <div  v-if="status">
        <div class="label">{{strategy}}</div>
        <div class="container">
          <div class="status" v-bind:style="{ width: setWidth(strategy), 'background-color': 'red' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Results',
  props: {
    state: Object
  },
  methods: {
    setWidth(strategy) {
      console.log(strategy)
      return '50%'
    }
  }
}
</script>

<style>
  .results .container {
    width: 90%;
    margin: 0 auto;
    height: 30px;
    border: 1px solid;
    max-width: 800px;
  }
  .results .label {
    display: inline-block;
    width: 10%;
  }
  .results .container {
    display: inline-block;
    width: 90%;
  }
  .results .status {
    height: 100%;
    background-color: green;
    width: 10%;
  }
</style>
