<template>
  <div id="app">
  <h1>Interdependent Teams Simulation</h1>
    <button @click="setState">Set State</button>
    <div class="run-type">
      Type of Run:
      <div class="radio">
        <input type="radio" id="fullRun" name="runType" value="Full Run" v-model="state['runType']">
        <label for="fullRun">Full Run</label>
      </div>
      <div class="radio">
        <input type="radio" id="fullStrategy" name="runType" value="Full Strategy" v-model="state['runType']">
        <label for="fullRun">Full Strategy</label>
      </div>
      <div class="radio">
        <input type="radio" id="stepThrough" name="runType" value="Step Through" v-model="state['runType']">
        <label for="stepThrough">Step-Through</label>
      </div>
      <button @click="start" class="start">Start Run</button>
      <button v-if="state['runType'] == 'Step Through'" @click="nextSprint" class="next-sprint" :disabled="state['complete'] == true">Next Sprint</button>
    </div>
    <div class="strategy">
      Strategies:
      <div class="radio">
        <input type="checkbox" id="ownFirst" name="ownFirst" value="Own First" v-model="state['strategies']['own-first']">
        <label for="ownFirst">Own Work First</label>
        <input type="checkbox" id="ownFirstUnlessBlocked" name="ownFirstUnlessBlocked" value="Own First Unless Blocked" v-model="state['strategies']['own-first-unless-blocked']">
        <label for="ownFirstUnlessBlocked">Own Work First Unless Blocked</label>
        <input type="checkbox" id="otherFirst" name="otherFirst" value="Others First" v-model="state['strategies']['others-first']">
        <label for="otherFirst">Other's Work First</label>
      </div>
    </div>
    <StateView v-bind:state="state" />
    <ResultsView v-bind:state="state" />
  </div>
</template>

<script>
import StateView from './components/StateView.vue'
import ResultsView from './components/ResultsView.vue'

export default {
  name: 'App',
  components: {
    StateView,
    ResultsView
  },
  data() {
    return {
      state: {
        runType: 'Step Through',
        continue: false,
        sprint: 0,
        complete: false,
        strategies: {
          'own-first': true,
          'own-first-unless-blocked': true,
          'others-first': true,
        },
        strategy: '',
        suits: {
           hearts: { current: 0, blocked: false, cards: [], others: [], 'for others': [] },
          clubs: { current: 0, blocked: false, cards: [], others: [], 'for others': [] },
          diamonds: { current: 0, blocked: false, cards: [], others: [], 'for others': [] },
          spades: { current: 0, blocked: false, cards: [], others: [], 'for others': [] }
        }
      }
    }
  },
  methods: {
    getRandomIndex(n) {
      return Math.floor(Math.random() * Math.floor(n))
    },
    createState() {
      this.state['suits'] = {
        hearts: { current: 0, blocked: true, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: [], 'for others': []},
        clubs: { current: 0, blocked: false, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: [], 'for others': []},
        diamonds: { current: 0, blocked: false, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: [], 'for others': []},
        spades: { current: 0, blocked: false, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: [], 'for others': []}
      }
    },
    setState() {

      this.createState()

      for (suit in this.state['suits']) {
        this.state['suits'][suit]['current'] = this.getRandomIndex(14)
      }

      // Get 3 cards to give to other teams
      for (var suit in this.state['suits']) {
        var thisSuit = this.state['suits'][suit]

        for (var i = 0; i < 3; i++) {
          var index = this.getRandomIndex(thisSuit['cards'].length)
          var other = thisSuit['cards'][index]
          thisSuit['for others'].push(other)
          thisSuit['cards'].splice(index, 1)
        }
        this.state['suits'][suit]['cards']  = thisSuit['cards']
      }

      // Give the cards to other teams
      for (suit in this.state['suits']) {
        i = 0
        for (var otherSuit in this.state['suits']) {
          if (suit != otherSuit) {
            this.state['suits'][otherSuit]['others'].push({'suit': suit, 'card': this.state['suits'][suit]['for others'][i] })
            i++
          }
        }
      }
    },
    nextSprint() {
      this.state['sprint'] = this.state['sprint'] + 1
      console.log('Sprint ' + this.state['sprint'])
    },
    start() {
    }
  }
}
</script>
