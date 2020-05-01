<template>
  <div class="state">
    <h2>State</h2>
    <div class="suit">
      <div v-for="(cards, suit) in state" :key="suit" :class="suit">
        <div :class="suit">{{suit}}</div>
        <div class="label">Current:</div><div :class="getCard(state[suit]['current'])"></div>
        <div class="label">Blocked:</div>
        <div v-if="!state[suit]['blocked']" class="blocked">No</div>
        <div v-if="state[suit]['blocked']" class="blocked">Yes</div>
        <div class="label">Own:</div>
        <div class="own">
          <div v-for="card in suit_cards" :key="card" :class="card"></div>
        </div>
        <div class="label">Others:</div>
        <div class="others">
          <div v-for="card in state[suit]['others']" :key="card['card']" :class="[card['suit'], getCard(card['card'])]"></div>
        </div>
      </div>
    </div>

    <button @click="setState">Set State</button>
  </div>
</template>

<script>
export default {
  name: 'State',
  props: {},
  data() {
    return {
      suit_cards: [
        'ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'jack', 'queen', 'king'],
      state: {
        hearts: { current: 0, blocked: true, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: [{suit: 'clubs', card: 6}]},
        clubs: { current: 1, blocked: false, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: [{suit: 'spades', card: 1}]},
        diamonds: { current: 11, blocked: false, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: []},
        spades: { current: 0, blocked: false, cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], others: []}
      }
    }
  },
  methods: {
    getCard(n) {
      return this.suit_cards[n - 1]
    },
    setState() {
       this.state['spades']['others'] = [{suit: 'diamionds', card: 13}]
    }
  }
}
</script>
