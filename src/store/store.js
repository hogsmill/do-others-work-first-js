import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

function getRandomIndex(n) {
  return Math.floor(Math.random() * Math.floor(n));
}

function _setInitialStateCards(state) {

  var suit, i

  // Get N cards to give to other teams
  for (suit in state.suits) {
    var thisSuit = state.suits[suit];

    for (i = 0; i < state.noOfOthersCards; i++) {
      var index = getRandomIndex(thisSuit.cards.length);
      var other = thisSuit.cards[index];
      thisSuit["for others"].push(other);
      thisSuit.cards.splice(index, 1);
    }
    state.suits[suit].cards = thisSuit.cards
  }

  // Give the cards to other teams
  for (suit in state.suits) {
    i = 0;
    for (var otherSuit in state.suits) {
      if (suit != otherSuit) {
        state.suits[otherSuit].others.push({
          suit: suit,
          card: state.suits[suit]["for others"][i]
        });
        i++;
      }
    }
  }

  return state
}

function _getInitialState(state) {
  var i,
    suits = ['hearts', 'clubs', 'diamonds', 'spades'],
    strategies = ['own-first', 'own-first-unless-blocked', 'others-first'],
    strategyNames = {
      'own-first': 'Own First',
      'own-first-unless-blocked': 'Own First Unless Blocked',
      'others-first': 'Others First'
    }

  for (i = 0; i < suits.length; i++) {
    var suit = suits[i]
    var cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    state.suits[suit] = { current: 0, blocked: false, cards: cards, others: [], "for others": [] }
  }
  for (i = 0; i < strategies.length; i++) {
    var strategy = strategies[i],
      strategyName = strategyNames[strategy]
    state.strategies[strategy] = { name: strategyName, run: true, current: false, sprints: 0, complete: false }
  }

  state = _setInitialStateCards(state)

  return state
}

export const store = new Vuex.Store({
  state: {
    showAbout: false,
    walkThrough: false,
    host: false,
    stateSet: false,
    initialState: {
      maxSprints: 60,
      runType: "Step Through",
      complete: false,
      running: false,
      suits: {},
      noOfOthersCards: 3,
      strategies: {},
      strategy: "",
      narration: [],
    },
    state: {}
  },
  getters: {
    getWalkThrough: (state) => {
      return state.walkThrough;
    },
    getShowAbout: (state) => {
      return state.showAbout;
    },
    getHost: (state) => {
      return state.host;
    },
    getStateSet: (state) => {
      return state.stateSet;
    },
    getInitialState: (state) => {
      return _getInitialState(state.initialState)
    },
    getState: (state) => {
      return state.state;
    },
    getMaxSprints: (state) => {
      return state.state.maxSprints;
    }
  },
  mutations: {
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload;
    },
    updateShowAbout: (state, payload) => {
      state.showAbout = payload;
    },
    updateHost: (state, payload) => {
      state.host = payload;
    },
    updateStateSet: (state, payload) => {
      state.stateSet = payload;
    },
    updateState: (state, payload) => {
      state.state = payload;
    },
    updateMaxSprints: (state, payload) => {
      state.state.maxSprints = payload;
    }
  },
  actions: {
    updateWalkThrough: ({ commit }, payload) => {
      commit("updateWalkThrough", payload);
    },
    updateShowAbout: ({ commit }, payload) => {
      commit("updateShowAbout", payload);
    },
    updateHost: ({ commit }, payload) => {
      commit("updateHost", payload);
    },
    updateStateSet: ({ commit }, payload) => {
      commit("updateStateSet", payload);
    },
    updateState: ({ commit }, payload) => {
      commit("updateState", payload);
    },
    updateMaxSprints: ({ commit }, payload) => {
      commit("updateMaxSprints", payload);
    }
  }
});
