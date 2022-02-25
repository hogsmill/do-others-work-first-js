<template>
  <div>
    <button v-if="!showAbout" class="btn btn-sm btn-info" @click="help">
      Explain this for me...
    </button>
  </div>
</template>

<script>
import params from '../../lib/params.js'

export default {
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
  },
  mounted() {
    if (params.isParam('walkThrough')) {
      this.$store.dispatch('updateWalkThrough', true)
      this.$store.dispatch('showModal', 'walkThrough')
    }
  },
  methods: {
    help() {
      this.$store.dispatch('showModal', 'walkThrough')
    }
  }
}
</script>

<style scope>
  .btn {
    padding: 6px;
    margin: 12px;
  }
</style>
