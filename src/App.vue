<template>
  <div id="app" class="mb-4">
    <appHeader />
    <WalkThroughView />
    <div v-if="showAbout">
      <AboutView />
    </div>
    <div v-if="!showAbout">
      <div class="container">
        <div class="row">
          <div class="setup col-md-4 offset-md-2 mb-2 mr-2">
            <h3 class="text-center">
              Set Up
            </h3>
            <div class="radio" v-if="explore == 'explore'">
              <label for="noOfOthersCards">No. Of Others Cards</label>
              <input
                type="text"
                id="noOfOthersCards"
                name="noOfOthersCards"
                v-model="initialState.noOfOthersCards"
              >
            </div>
            <button
              class="btn btn-site-primary"
              @click="setState"
              :disabled="state['running']"
            >
              Set State
            </button>
          </div>
          <div class="control col-md-4 mb-2 ml-2">
            <h3 class="text-center">
              Control
            </h3>
            <div class="run-type" v-if="explore == 'explore'">
              <div>Type of Run:</div>
              <div class="radio">
                <input
                  type="radio"
                  id="fullRun"
                  name="runType"
                  v-model="initialState.runType"
                >
                <label for="fullRun">Full Run</label>
              </div>
              <div class="radio">
                <input
                  type="radio"
                  id="fullStrategy"
                  name="runType"
                  v-model="initialState.runType"
                >
                <label for="fullRun">Full Strategy</label>
              </div>
              <div class="radio">
                <input
                  type="radio"
                  id="stepThrough"
                  name="runType"
                  v-model="initialState.runType"
                >
                <label for="stepThrough">Step Through</label>
              </div>
            </div>
            <button
              id="go-button"
              @click="nextSprint"
              class="next-sprint btn btn-site-primary"
              :disabled="!stateSet || state.complete || state.running"
            >
              Go
            </button>
          </div>
          <div class="strategies" v-if="explore == 'explore'">
            <h2>Strategies</h2>
            <div class="radio">
              <input
                type="checkbox"
                id="ownFirst"
                name="ownFirst"
                v-model="state.strategies['own-first'].run"
              >
              <label for="ownFirst">Own Work First</label>
            </div>
            <div class="radio">
              <input
                type="checkbox"
                id="ownFirstUnlessBlocked"
                name="ownFirstUnlessBlocked"
                v-model="state.strategies['own-first-unless-blocked'].run"
              >
              <label for="ownFirstUnlessBlocked">Own Work First Unless Blocked</label>
            </div>
            <div class="radio">
              <input
                type="checkbox"
                id="otherFirst"
                name="otherFirst"
                v-model="state.strategies['others-first'].run"
              >
              <label for="otherFirst">Other's Work First</label>
            </div>
          </div>
        </div>
        <StateView :state="state" />
        <ResultsView :state="state" />
      </div>
    </div>
    <Modals />
  </div>
</template>

<script>
import io from 'socket.io-client'

import params from './lib/params.js'

import Header from './components/Header.vue'
import AboutView from './components/about/AboutView.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'
import StateView from './components/StateView.vue'
import ResultsView from './components/ResultsView.vue'
import Modals from './components/Modals.vue'

export default {
  name: 'App',
  components: {
    appHeader: Header,
    AboutView,
    WalkThroughView,
    StateView,
    ResultsView,
    Modals
  },
  data() {
    return {
      explore: 'run',
      initialState: {},
      state: {}
    }
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    stateSet() {
      return this.$store.getters.getStateSet
    },
    getInitialState() {
      return this.$store.getters.getInitialState
    },
    maxSprints() {
      return this.$store.getters.getMaxSprints
    }
  },
  created() {
    let connStr
    if (location.hostname == 'localhost') {
      connStr = 'http://localhost:3001'
    } else {
      connStr = 'https://agilesimulations.co.uk:3001'
    }
    console.log('Connecting to: ' + connStr)
    this.socket = io(connStr)

    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }
    if (params.isParam('walkThrough')) {
      this.setState()
    }
  },
  mounted() {
    this.socket.on('setRemoteState', (data) => {
      this.setRemoteState(data)
    }),
    this.socket.on('nextSprint', () => {
      this._nextSprint()
    }),
    this.socket.on('setInitialState', () => {
      this.setState()
    })
  },
  methods: {
    updateShowAbout(payload) {
      this.$store.dispatch('updateShowAbout', payload)
    },
    setState() {
      this.initialState = this.getInitialState
      this.socket.emit('setRemoteState', JSON.stringify(this.initialState))
    },
    setRemoteState(data) {
      this.initialState = JSON.parse(data)
      this.state = JSON.parse(data)
      this.$store.dispatch('updateStateSet', true)
    },
    resetState() {
      this.state['suits'] = JSON.parse(
        JSON.stringify(this.initialState['suits'])
      )
    },
    strategyComplete() {
      let complete = true
      for (const suit in this.state['suits']) {
        if (this.state['suits'][suit]['current'] < 13) {
          complete = false
        }
      }
      return complete
    },
    allBlocked() {
      let allBlocked = true
      for (const suit in this.state['suits']) {
        if (!this.state['suits'][suit]['blocked']) {
          allBlocked = false
        }
      }
      return allBlocked
    },
    insertCard(card, suit) {
      this.state['suits'][suit]['cards'].push(card)
      this.state['suits'][suit]['cards'].sort(function(a, b) {
        return a - b
      })
      if (
        this.state['suits'][suit]['current'] + 1 ==
        this.state['suits'][suit]['cards'][0]
      ) {
        this.state['suits'][suit]['blocked'] = false
      }
    },
    playOthersCard(suit) {
      if (this.state['suits'][suit]['others'].length) {
        const card = this.state['suits'][suit]['others'][0]
        this.state.narration.push({ suit: suit, card: card })
        this.insertCard(card['card'], card['suit'])
        this.state['suits'][suit]['others'].shift()
      }
    },
    playOwnCard(suit) {
      this.state['suits'][suit]['current'] = this.state['suits'][suit][
        'cards'
      ][0]
      this.state['suits'][suit]['cards'].shift()
    },
    playNextCardOwnFirst() {
      for (const suit in this.state['suits']) {
        if (this.allBlocked() && this.state['suits'][suit]['others'].length) {
          this.playOthersCard(suit)
        } else {
          if (
            this.state['suits'][suit]['current'] + 1 ==
            this.state['suits'][suit]['cards'][0]
          ) {
            this.playOwnCard(suit)
          } else {
            this.state['suits'][suit]['blocked'] = true
          }
        }
      }
    },
    playNextCardOwnFirstUnlessBlocked() {
      for (const suit in this.state['suits']) {
        if (
          this.state['suits'][suit]['blocked'] &&
          this.state['suits'][suit]['others'].length
        ) {
          this.playOthersCard(suit)
        } else {
          if (
            this.state['suits'][suit]['current'] + 1 ==
            this.state['suits'][suit]['cards'][0]
          ) {
            this.playOwnCard(suit)
          } else {
            this.state['suits'][suit]['blocked'] = true
          }
        }
      }
    },
    playNextCardOthersFirst() {
      for (const suit in this.state['suits']) {
        if (this.state['suits'][suit]['others'].length) {
          this.playOthersCard(suit)
        } else {
          if (
            this.state['suits'][suit]['current'] + 1 ==
            this.state['suits'][suit]['cards'][0]
          ) {
            this.playOwnCard(suit)
          } else {
            this.state['suits'][suit]['blocked'] = true
          }
        }
      }
    },
    playNextCard(strategy) {
      if (strategy == 'own-first') {
        this.playNextCardOwnFirst()
      }
      if (strategy == 'own-first-unless-blocked') {
        this.playNextCardOwnFirstUnlessBlocked()
      }
      if (strategy == 'others-first') {
        this.playNextCardOthersFirst()
      }
    },
    nextSprint() {
      this.socket.emit('nextSprint')
    },
    _nextSprint() {
      let strategy = this.getCurrentStrategy()
      let strategyCompleted = false
      this.state['running'] = true
      this.state['narration'] = []
      if (strategy) {
        this.playNextCard(strategy)
        this.state['strategies'][strategy]['sprints'] =
          this.state['strategies'][strategy]['sprints'] + 1
        if (
          this.strategyComplete() ||
          this.state['strategies'][strategy]['sprints'] >=
            this.maxSprints
        ) {
          this.state['strategies'][strategy]['complete'] = true
          strategyCompleted = true
          this.resetState()
        }
      }
      let complete = true
      for (strategy in this.state['strategies']) {
        if (
          this.state['strategies'][strategy]['run'] &&
          !this.state['strategies'][strategy]['complete']
        ) {
          complete = false
        }
      }
      if (complete) {
        this.state['running'] = false
        return
      }
      if (
        this.state['runType'] == 'Full Run' ||
        (this.state['runType'] == 'Full Strategy' && !strategyCompleted)
      ) {
        setTimeout(this.nextSprint, 500)
      } else {
        this.state['running'] = false
      }
    },
    getCurrentStrategy() {
      let currentStrategy = false, strategy
      for (strategy in this.state['strategies']) {
        if (
          this.state['strategies'][strategy]['current'] &&
          !this.state['strategies'][strategy]['complete']
        ) {
          currentStrategy = strategy
        }
      }
      if (!currentStrategy) {
        for (strategy in this.state['strategies']) {
          if (
            !currentStrategy &&
            this.state['strategies'][strategy]['run'] &&
            !this.state['strategies'][strategy]['complete']
          ) {
            currentStrategy = strategy
            this.state.strategies[strategy].current = true
          }
        }
      }
      return currentStrategy
    },
  }
}
</script>

<style>
.menu {
  text-align: right;
  background-color: #ccc;
  padding: 6px;
}
.menu span {
  margin: 0 4px 0 4px;
}
.menu span:hover {
  text-decoration: underline;
}
.selected {
  text-decoration: underline;
  font-weight: bold;
}
.scope {
  text-align: right;
  padding-right: 6px;
}
.radio {
  display: block;
  text-align: left;
}
.setup,
.control {
  padding: 10px 10px;
  display: inline-block;
  width: 20%;
  vertical-align: top;
  border: 1px solid #cccccc;
  border-radius: 5px;
  background-color: #f8f9fa;
}
.setup input {
  width: 20px;
  margin-left: 4px;
}

.strategies {
  padding: 0 6px;
  display: inline-block;
  width: 20%;
  vertical-align: top;
}
</style>
