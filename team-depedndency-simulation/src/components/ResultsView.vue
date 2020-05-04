<template>
  <div class="results">
    <h2>Results
    <span v-if="state['complete']">(Complete)</span>
    <span v-if="!state['complete']">(Sprint {{state['sprint']}})</span>
    </h2>
    <div v-for="(status, strategy) in state['strategies']" :key="strategy" :class="strategy">
      <div  v-if="status['run']">
        <div class="label">{{strategy}}</div>
        <div class="container">
          <div v-if="status['sprints'] > 0" class="status" v-bind:style="{ width: setWidth(status), 'background-color': setColor(status) }">{{status['sprints']}}</div>
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
    setWidth(status) {
      return status['sprints'] / this.state['maxSprints'] * 100 + '%'
    },
    setColor(status) {
      if (status['sprints'] > 5) {
        return 'green'
      } else {
        return 'red'
      }
    }
  }
}
</script>

<style>
  .results .container {
    margin: 0 auto;
    height: 30px;
    border: 1px solid #bbb;
    max-width: 800px;
    display: inline-block;
    width: 83%;
    margin-bottom: 4px;
  }
  .results .label {
    display: inline-block;
    width: 17%;
  }
  .results .status {
    line-height: 1.9;
    color: #fff;
    height: 100%;
    background-color: green;
    width: 10%;
    text-align: right;
    padding-right: 2px
  }
</style>
