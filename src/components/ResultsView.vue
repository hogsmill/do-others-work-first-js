<template>
  <div class="results mb-5">
    <h2>Results (No. of Sprints)</h2>
    <div
      v-for="(status, strategy) in state.strategies"
      :key="strategy"
      :class="strategy"
    >
      <div v-if="status.run" class="row">
        <div class="label col-md-3">
          {{ state.strategies[strategy].name }}
        </div>
        <div class="app-container col-md-9">
          <div
            v-if="status.sprints > 0"
            class="status"
            v-bind:style="{
              width: setWidth(status),
              'background-color': setColor(strategy),
              color: setTextColor(strategy)
            }"
          >
            {{ status.sprints }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Results",
  props: {
    state: Object,
  },
  methods: {
    setWidth(status) {
      return (status.sprints / this.maxSprints) * 100 + "%";
    },
    setColor(strategy) {
      if (this.state.strategies[strategy].complete) {
        if (this.state.strategies[strategy].sprints < this.maxSprints) {
          return "green";
        } else {
          return "red";
        }
      } else {
        return "#ccc";
      }
    },
    setTextColor(strategy) {
      if (this.state.strategies[strategy].complete) {
        return '#fff'
      } else {
        return '#333'
      }
    }
  },
  computed: {
    maxSprints() {
      return this.$store.getters.getMaxSprints;
    }
  }
};
</script>

<style>
.results .app-container {
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
  margin-top: 3px;
  width: 17%;
}
.results .status {
  line-height: 1.9;
  height: 100%;
  width: 10%;
  text-align: right;
  padding-right: 5px;
  margin-left: -15px;
}
</style>
