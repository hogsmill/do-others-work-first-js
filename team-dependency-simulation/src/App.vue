<template>
  <div id="app">
    <div class="menu">
    <span @click="function() { showAbout = false}" :class="{ selected: !showAbout }">Simulation</span>
      <span @click="function() { showAbout = true}" :class="{ selected: showAbout }">About</span>
    </div>
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-if="!showAbout">
      <h1>Interdependent Teams Simulation</h1>
      <div class="scope">
        <input type="radio" id="runScope" name="runScope" value="run" v-model="explore">
        <label for="runScope">Just run it</label>
        <input type="radio" id="runScope" name="runScope" value="explore" v-model="explore">
        <label for="fullRun">I want to explore</label>
      </div>
      <div class="setup">
        <h2>Set Up</h2>
        <div class="radio" v-if="explore == 'explore'">
          <label for="noOfOthersCards">No. Of Others Cards</label>
          <input type="text" id="noOfOthersCards" name="noOfOthersCards" value="No. Of Others Cards" v-model="initialState['noOfOthersCards']">
        </div>
        <button @click="setState" :disabled="state['running']">Set State</button>
      </div>
      <div class="control">
        <h2>Control</h2>
        <div class="run-type" v-if="explore == 'explore'">
          <div>Type of Run:</div>
          <div class="radio">
            <input type="radio" id="fullRun" name="runType" value="Full Run" v-model="initialState['runType']">
            <label for="fullRun">Full Run</label>
          </div>
          <div class="radio">
            <input type="radio" id="fullStrategy" name="runType" value="Full Strategy" v-model="initialState['runType']">
            <label for="fullRun">Full Strategy</label>
          </div>
          <div class="radio">
            <input type="radio" id="stepThrough" name="runType" value="Step Through" v-model="initialState['runType']">
            <label for="stepThrough">Step Through</label>
          </div>
        </div>
        <button @click="nextSprint" class="next-sprint" :disabled="!stateSet || state['complete'] || state['running']">Go</button>
      </div>
      <div class="strategies" v-if="explore == 'explore'">
        <h2>Strategies</h2>
        <div class="radio">
          <input type="checkbox" id="ownFirst" name="ownFirst" value="Own First" v-model="state['strategies']['own-first']['run']">
          <label for="ownFirst">Own Work First</label>
        </div>
        <div class="radio">
          <input type="checkbox" id="ownFirstUnlessBlocked" name="ownFirstUnlessBlocked" value="Own First Unless Blocked" v-model="state['strategies']['own-first-unless-blocked']['run']">
          <label for="ownFirstUnlessBlocked">Own Work First Unless Blocked</label>
        </div>
        <div class="radio">
          <input type="checkbox" id="otherFirst" name="otherFirst" value="Others First" v-model="state['strategies']['others-first']['run']">
          <label for="otherFirst">Other's Work First</label>
        </div>
      </div>
      <StateView v-bind:state="state" />
      <ResultsView v-bind:state="state" />
    </div>
  </div>
</template>

<script>
import AboutView from './components/AboutView.vue'
import StateView from './components/StateView.vue'
import ResultsView from './components/ResultsView.vue'

export default {
  name: 'App',
  components: {
    AboutView,
    StateView,
    ResultsView
  },
  data() {
    return {
      showAbout: false,
      stateSet: false,
      explore: 'run',
      initialState: {
        runType: 'Step Through',
        maxSprints: 60,
        complete: false,
        running: false,
        noOfOthersCards: 3,
        strategies: {},
        strategy: '',
        suits: {
          hearts: { current: 0, blocked: false, cards: [], others: [], 'for others': [] },
          clubs: { current: 0, blocked: false, cards: [], others: [], 'for others': [] },
          diamonds: { current: 0, blocked: false, cards: [], others: [], 'for others': [] },
          spades: { current: 0, blocked: false, cards: [], others: [], 'for others': [] }
        },
        narration: []
      },
      state: {
        maxSprints: 60,
        strategies: {
          'own-first': { name: 'Own First', run: true, current: false, sprints: 0, complete: false },
          'own-first-unless-blocked': { name: 'Own First Unless Blocked', run: true, current: false, sprints: 0, complete: false },
          'others-first': { name: 'Others First', run: true, current: false, sprints: 0, complete: false },
        },
        suits: {
          hearts: { cards: [] },
          clubs: { cards: [] },
          diamonds: { cards: [] },
          spades: { cards: [] }
        },
        narration: []
      },
    }
  },
  methods: {
    getRandomIndex(n) {
      return Math.floor(Math.random() * Math.floor(n))
    },
    populateInitialState() {
      this.initialState['strategies'] = {
        'own-first': { name: 'Own First', run: true, current: false, sprints: 0, complete: false },
        'own-first-unless-blocked': { name: 'Own First Unless Blocked', run: true, current: false, sprints: 0, complete: false },
        'others-first': { name: 'Others First', run: true, current: false, sprints: 0, complete: false },
      },
      this.initialState['suits'] = {
        hearts: { current: 0, blocked: false, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: [], 'for others': []},
        clubs: { current: 0, blocked: false, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: [], 'for others': []},
        diamonds: { current: 0, blocked: false, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: [], 'for others': []},
        spades: { current: 0, blocked: false, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: [], 'for others': []}
      }
    },
    findSuitToGiveCardTo() {

    },
    setState() {

      this.populateInitialState()

      // Get N cards to give to other teams
      for (var suit in this.initialState['suits']) {
        var thisSuit = this.initialState['suits'][suit]

        for (var i = 0; i < this.initialState['noOfOthersCards']; i++) {
          var index = this.getRandomIndex(thisSuit['cards'].length)
          var other = thisSuit['cards'][index]
          thisSuit['for others'].push(other)
          thisSuit['cards'].splice(index, 1)
        }
        this.initialState['suits'][suit]['cards']  = thisSuit['cards']
      }

      // Give the cards to other teams
      for (suit in this.initialState['suits']) {
        i = 0
        for (var otherSuit in this.initialState['suits']) {
          if (suit != otherSuit) {
            this.initialState['suits'][otherSuit]['others'].push({'suit': suit, 'card': this.initialState['suits'][suit]['for others'][i] })
            i++
          }
        }
      }
      this.state = JSON.parse(JSON.stringify(this.initialState))
      console.log(this.state)
      this.stateSet = true
    },
    resetState() {
      this.state['suits'] = JSON.parse(JSON.stringify(this.initialState['suits']))
    },
    strategyComplete() {
      var complete = true
      for (var suit in this.state['suits']) {
        if (this.state['suits'][suit]['current'] < 13) {
          complete = false
        }
      }
      return complete
    },
    allBlocked() {
      var allBlocked = true
      for (var suit in this.state['suits']) {
        if (!this.state['suits'][suit]['blocked']) {
          allBlocked = false
        }
      }
      return allBlocked
    },
    insertCard(card, suit) {
      this.state['suits'][suit]['cards'].push(card)
      this.state['suits'][suit]['cards'].sort(function(a, b) {return a - b})
      if (this.state['suits'][suit]['current'] + 1 == this.state['suits'][suit]['cards'][0]) {
        this.state['suits'][suit]['blocked'] = false
      }
    },
    playOthersCard(suit) {
      if (this.state['suits'][suit]['others'].length) {
        var card = this.state['suits'][suit]['others'][0]
        this.state.narration.push({suit: suit, card: card})
        this.insertCard(card['card'], card['suit'])
        this.state['suits'][suit]['others'].shift()
      }
    },
    playOwnCard(suit) {
      this.state['suits'][suit]['current'] = this.state['suits'][suit]['cards'][0]
      this.state['suits'][suit]['cards'].shift()
    },
    playNextCardOwnFirst() {
      for (var suit in this.state['suits']) {
        if (this.allBlocked() && this.state['suits'][suit]['others'].length) {
          this.playOthersCard(suit)
        } else {
          if (this.state['suits'][suit]['current'] + 1 == this.state['suits'][suit]['cards'][0]) {
            this.playOwnCard(suit)
          } else {
            this.state['suits'][suit]['blocked'] = true
          }
        }
      }
    },
    playNextCardOwnFirstUnlessBlocked() {
      for (var suit in this.state['suits']) {
        if (this.state['suits'][suit]['blocked'] && this.state['suits'][suit]['others'].length) {
          this.playOthersCard(suit)
        } else {
          if (this.state['suits'][suit]['current'] + 1 == this.state['suits'][suit]['cards'][0]) {
            this.playOwnCard(suit)
          } else {
            this.state['suits'][suit]['blocked'] = true
          }
        }
      }
    },
    playNextCardOthersFirst() {
      for (var suit in this.state['suits']) {
        if (this.state['suits'][suit]['others'].length) {
          this.playOthersCard(suit)
        } else {
          if (this.state['suits'][suit]['current'] + 1 == this.state['suits'][suit]['cards'][0]) {
            this.playOwnCard(suit)
          } else {
            this.state['suits'][suit]['blocked'] = true
          }
        }
      }
    },
    playNextCard(strategy) {
      console.log(strategy)
      if (strategy == 'own-first') { this.playNextCardOwnFirst() }
      if (strategy == 'own-first-unless-blocked') { this.playNextCardOwnFirstUnlessBlocked() }
      if (strategy == 'others-first') { this.playNextCardOthersFirst() }
    },
    nextSprint() {
      var strategy = this.getCurrentStrategy()
      var strategyCompleted = false
      this.state['running'] = true
      this.state['narration'] = []
      if (strategy) {
        this.playNextCard(strategy)
        this.state['strategies'][strategy]['sprints'] = this.state['strategies'][strategy]['sprints'] + 1
        if (this.strategyComplete() || this.state['strategies'][strategy]['sprints'] >= this.state['maxSprints']) {
          this.state['strategies'][strategy]['complete'] = true
          strategyCompleted = true
          this.resetState()
        }
      }
      var complete = true
      for (strategy in this.state['strategies']) {
        if (this.state['strategies'][strategy]['run'] && ! this.state['strategies'][strategy]['complete']) {
          complete = false
        }
      }
      if (complete) {
        this.state['running'] = false
        return
      }
      if (this.state['runType'] == "Full Run" || (this.state['runType'] == "Full Strategy" && !strategyCompleted)) {
        setTimeout(this.nextSprint, 500);
      } else {
        this.state['running'] = false
      }
    },
    getCurrentStrategy() {
      var currentStrategy = false
      for (var strategy in this.state['strategies']) {
        if (this.state['strategies'][strategy]['current'] && !this.state['strategies'][strategy]['complete']) {
          currentStrategy = strategy
        }
      }
      if (!currentStrategy) {
        for (strategy in this.state['strategies']) {
          if (!currentStrategy && this.state['strategies'][strategy]['run'] && !this.state['strategies'][strategy]['complete']) {
            currentStrategy = strategy
            this.state['strategies'][strategy]['current'] = true
          }
        }
      }
      return currentStrategy
    }
  }
}
</script>

<style>
  .menu { text-align: right; background-color: #ccc; padding: 6px; }
  .menu span { margin: 0 4px 0 4px; }
  .menu span:hover { text-decoration: underline; }
  .selected { text-decoration: underline; font-weight: bold; }
  .scope { text-align: right; padding-right: 6px; }
  .radio { display: block; text-align: left; }
  .setup { padding: 0 6px; display: inline-block; width: 20%; vertical-align: top; }
  .setup input { width: 20px; margin-left: 4px; }
  .control { padding: 0 6px; display: inline-block; width: 20%; vertical-align: top; }
  .strategies { padding: 0 6px; display: inline-block; width: 20%; vertical-align: top; }
</style>
