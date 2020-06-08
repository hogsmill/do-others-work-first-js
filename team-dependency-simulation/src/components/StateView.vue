<template>
  <div class="state mb-4 mt-3 row text-center">
    <div class="col-md-12">
      <h2>
        State <span v-if="state['runType']">({{ state["runType"] }})</span
        ><span v-if="state['strategy']">, Strategy {{ strategy }}</span>
      </h2>
      <div class="narration">
        <div v-if="state['narration'].length">
          <strong>All Blocked: </strong>
        </div>
        <div
          v-for="item in state['narration']"
          :key="item['card']['suit'] + '-' + item['card']['card']"
        >
          <div class="suit-label-small" :class="item['suit']"></div>
          <span> is playing </span>
          <span>{{ getCard(item["card"]["card"]) }} of </span>
          <div class="suit-label-small" :class="item['card']['suit']"></div>
          <span>. </span>
        </div>
      </div>
    </div>
    <div class="suit row">
      <div class="col-md-12">
        <div v-for="(cards, suit) in state['suits']" :key="suit" :class="suit">
          <div class="suit-label" :class="suit"></div>
          <div class="label current">Current:</div>
          <div
            :class="[suit, getCard(state['suits'][suit]['current'])]"
            class="card"
          ></div>
          <div class="label blocked">Blocked:</div>
          <div v-if="!state['suits'][suit]['blocked']" class="blocked">No</div>
          <div v-if="state['suits'][suit]['blocked']" class="blocked">Yes</div>
          <div class="label">Own:</div>
          <div class="own">
            <div v-for="card in suit_cards" :key="card">
              <div
                v-if="!missing(card, state['suits'][suit]['cards'])"
                :class="[card, suit]"
                class="card"
              ></div>
              <div
                v-if="missing(card, state['suits'][suit]['cards'])"
                class="card"
                :style="{ 'background-color': cardDone(suit, card) }"
              ></div>
            </div>
          </div>
          <div class="label">Others:</div>
          <div class="others">
            <div
              v-for="card in state['suits'][suit]['others']"
              :key="card['suit'] + '-' + card['card']"
              :class="[card['suit'], getCard(card['card'])]"
              class="card"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "State",
  props: ["state"],
  data() {
    return {
      suit_cards: [
        "ace",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "jack",
        "queen",
        "king",
      ],
    };
  },
  methods: {
    getCard(n) {
      return this.suit_cards[n - 1];
    },
    getCardFromName(card) {
      return this.suit_cards.indexOf(card) + 1;
    },
    missing(card, cards) {
      return !cards.includes(this.getCardFromName(card));
    },
    cardDone(suit, card) {
      if (this.getCardFromName(card) <= this.state["suits"][suit]["current"]) {
        return "#7DCEA0";
      } else {
        return "#ddd";
      }
    },
  },
};
</script>

<style>
.narration {
  height: 32px;
  margin-bottom: 6px;
}
.narration div {
  display: inline;
  vertical-align: middle;
}
.narration .suit-label-small {
  display: inline-block;
  height: 12px;
  width: 12px;
}
.suit-label-small.hearts {
  background-image: url("../assets/img/hearts-small.png");
}
.suit-label-small.spades {
  background-image: url("../assets/img/spades-small.png");
}
.suit-label-small.diamonds {
  background-image: url("../assets/img/diamonds-small.png");
}
.suit-label-small.clubs {
  background-image: url("../assets/img/clubs-small.png");
}

.suit-label {
  background-repeat: no-repeat;
  height: 30px;
  width: 30px;
}
.suit-label.hearts {
  background-image: url("../assets/img/hearts.png");
}
.suit-label.spades {
  background-image: url("../assets/img/spades.png");
}
.suit-label.diamonds {
  background-image: url("../assets/img/diamonds.png");
}
.suit-label.clubs {
  background-image: url("../assets/img/clubs.png");
}
</style>
