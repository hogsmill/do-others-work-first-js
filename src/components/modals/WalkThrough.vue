<template>
  <vue-final-modal name="walk-through" classes="modal-container" content-class="vfm__content modal-content walk-through" v-model="modals['walkThrough']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4" v-if="step == 1">
      <h4>Welcome to the Interdependent Teams Simulation</h4>
      <div>
        <p>
          This simulation demonstrates strategies for optimising flow when teams
          are dependent on each other to complete their work.
        </p>
        <Facilitation />
      </div>
    </div>
    <div class="mt-4" v-if="step == 2">
      <h4>How It Works</h4>
      <div>
        <p>
          The organisation is simulated by having 4 interdependent teams, each one
          represented by a suit in a standard pack of playing cards -
          <span class="red">&hearts;</span>,
          <span>&spades;</span>,
          <span class="red">&diams;</span> and
          <span>&clubs;</span>. Each team has a "backlog" of all the cards in their
          suit - A, 2, 3 ... J, Q, K.
        </p>
        <p>
          Each team has to play all the cards in its backlog from Ace to King, The game is
          played in "Sprints" (like hands in a card game), where one card can be played
          each "Sprint". Cards must be played in ascending order - this simulates priority
          in a backlog.
        </p>
        <p>
          The game is complete when all cards have been played (<em>all work for all teams has been
            completed</em>).
        </p>
      </div>
    </div>
    <div class="mt-4" v-if="step == 3">
      <h4>How It Works</h4>
      <p>
        <em>However</em>, 3 of the cards in each team's backlog must be played
        by other teams. This is to simulate them being dependent on another team to do
        some work for them.
      </p>
      <p>
        If the next card a team has to play is with another team, they are blocked, and
        cannot play a card in the current sprint.
      </p>
    </div>
    <div class="mt-4" v-if="step == 4">
      <h4>Strategies For Other Team's Work</h4>
      <p>
        Three strategies are used to deal with work from other teams
      </p>
      <ol class="strategies-list">
        <li><strong>Own Team's Work First</strong></li>
        <li><strong>Own Team's Work First, Unless Blocked</strong></li>
        <li><strong>Other Team's Work First</strong></li>
      </ol>
    </div>
    <div class="mt-4" v-if="step == 5">
      <h4>Strategy 1: Own Team's Work First</h4>
      <p>
        In this strategy, teams concentrate on their own work (cards) until they
        are blocked. After a certain number of sprints, of course, every team is
        blocked, so nothing gets done.
      </p>
      <p>
        At this point in real life, we can imagine all the managers and team leads
        getting together, and having a big, expensive, prioritisation session to work
        out what work to do next.
      </p>
      <p>
        In the simulation, the outcome of this meeting would be "all teams play the lowest
        numbered other team's card", and the game continues...
      </p>
    </div>
    <div class="mt-4" v-if="step == 6">
      <h4>Strategy 2: Own Team's Work First, Unless Blocked</h4>
      <p>
        In this strategy, teams again concentrate on their own work (cards) until they
        are blocked. They then play the lowest other team's card, and the game continues.
      </p>
      <p>
        This would seem a good strategy, but blockages and delays are still common. Also,
        in real life, would a team ever run out of backlog items so they had time to do
        another team's work? Probably not.
      </p>
    </div>
    <div class="mt-4" v-if="step == 7">
      <h4>Strategy 3: Other Team's Work First</h4>
      <p>
        In this strategy, a team will always do other team's work before their own.
      </p>
      <p>
        This removes all the delay from the system, and eradicates all the expensive
        relative prioritisation between a team's work and other teams work. This makes sense -
        teams can't possibly know if their own work is more, or less, important than
        any other team's, as it is not their domain of expertise. It also forces
        collaboration between teams, as teams <em>must</em> finish other team's work
        before they can do their own stuff.
      </p>
    </div>
    <div class="mt-4" v-if="step == 8">
      <h4>Conclusions</h4>
      <p>
        In our experience, most organisations will be somewhere between strategies 1 and 2; however,
        most will be closer to strategy 1 than they would care to admit - teams are usually assessed
        on their own performance, not how much they help out other teams.
      </p>
      <p>
        However, both these strategies introduce delays and blockages, and are very costly in
        terms of time spent negotiating, prioritising and communicating. Bottom line - if a team
        can get away with <em>not</em> doing another team's work, they will. Only strategy
        3 - always do other's work before your own, encourages - indeed forces - collaboration
        and working towards the wider good of the business.
      </p>
      <p>
        A presentation from Agile Cambridge 2018 explores this in more detail. Click
        <a href="https://vimeo.com/293167264/13f201d4f0">here</a> to watch the video.
      </p>
    </div>
    <div class="mt-4" v-if="step == 9">
      <h4>Conclusions</h4>
      <p>
        If you run the simulation, you'll notice that strategy 1 can take up to 60
        sprints - given each team has only 13 cards to play, that is a <em>lot</em> of
        delay.
      </p>
      <p>
        Strategy 3, however - do others work before your own - takes about a third of this number
        of sprints. Yes, doing other team's work before your own is <em>up to 300% faster!</em>
      </p>
      <p>Give it a go, and see for yourself...</p>
    </div>
    <div class="mt-4" v-if="step == 10">
      <h4>Game Play</h4>
      <p>
        Simply click the "Go" button to step through the sprints. The number of sprints to get through
        all the work will be shown in the status bars below the view of the teams suits.
      </p>
      <p>Enjoy!</p>
    </div>
    <div class="buttons" v-if="step < 10">
      <button class="btn btn-info" @click="incrementStep">
        Next
      </button>
      <button class="btn btn-info" @click="hide()">
        Skip
      </button>
    </div>
    <div class="buttons" v-if="step == 10">
      <button class="btn btn-info" @click="hide()">
        Play Game
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

import params from '../../lib/params.js'

import Facilitation from './walkThrough/Facilitation.vue'

export default {
  components: {
    VueFinalModal,
    Facilitation
  },
  data() {
    return {
      step: 1
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  mounted() {
    if (params.isParam('walkThrough')) {
      this.$store.dispatch('showModal', 'walkThrough')
    }
  },
  methods: {
    skip() {
      this.hide()
    },
    hide() {
      this.$store.dispatch('hideModal', 'walkThrough')
    },
    incrementStep() {
      this.step = this.step + 1
    }
  }
}
</script>

<style lang="scss">
  .buttons {
    padding: 6px;
    position: absolute;
    bottom: 20px;
    width: 100%;
  }

  .walk-through {
    height: 480px;
    p {
      text-align: left;
      margin: 0 24px 12px 24px;

      &.center {
        text-align: center;
      }
    }
    ul {
      margin-bottom: 12px;

      li {
        margin: 6px 24px 12px 36px;
        text-align: left;
      }
    }
  }

  #walk-through p {
    margin-left: 12px;
    margin-right: 12px;
  }

  .game {
    background-image: url("../../assets/img/game.png");
    background-repeat: no-repeat;
    background-position-x: center;
    height: 95px;
  }

  .red {
    color: red;
  }

  .strategies-list li {
    line-height: 2;
  }
</style>
