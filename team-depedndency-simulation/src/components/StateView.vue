<template>
  <div class="state">
    <h2>State <span v-if="state['runType']">({{state['runType']}})</span><span v-if="state['strategy']">, Strategy {{strategy}}</span></h2>
    <div class="suit">
      <div v-for="(cards, suit) in state['suits']" :key="suit" :class="suit">
        <div class="suit-label">&{{suit}};</div>
        <div class="label current">Current:</div><div :class="[suit, getCard(state['suits'][suit]['current'])]" class="card"></div>
        <div class="label blocked">Blocked:</div>
        <div v-if="!state['suits'][suit]['blocked']" class="blocked">No</div>
        <div v-if="state['suits'][suit]['blocked']" class="blocked">Yes</div>
        <div class="label">Own:</div>
        <div class="own">
          <div v-for="card in suit_cards" :key="card">
            <div v-if="! missing(card, state['suits'][suit]['cards'])" :class="[card, suit]" class="card"></div>
            <div v-if="missing(card, state['suits'][suit]['cards'])" class="card" :style="{ 'background-color': cardDone(suit, card) }"></div>
          </div>
        </div>
        <div class="label">Others:</div>
        <div class="others">
          <div v-for="card in state['suits'][suit]['others']" :key="card['suit'] + '-' + card['card']" :class="[card['suit'], getCard(card['card'])]" class="card"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'State',
  props: ['state'],
  data() {
    return {
      suit_cards: [
        'ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'jack', 'queen', 'king']
    }
  },
  methods: {
    getCard(n) {
      return this.suit_cards[n - 1]
    },
    getCardFromName(card) {
      return this.suit_cards.indexOf(card) + 1
    },
    missing(card, cards) {
      return ! cards.includes(this.getCardFromName(card))
    },
    cardDone(suit, card) {
      if (this.getCardFromName(card) < this.state['suits'][suit]['current']) {
        return 'green'
      } else {
        return '#ddd'
      }
    }
  }
}
</script>
