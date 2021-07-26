<template>
  <div
    :class="[{ 'is-highlighted': isHighlighted }, color ]"
    class="grid-item rounded-circle"
  />
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
    isHighlighted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.is-highlighted {
  opacity: 0.5;
}

.grid-item.blue {
  background: radial-gradient(circle at 30px 30px, #5cabff, #000);
}

.grid-item.red {
  background: radial-gradient(circle at 30px 30px, #ff5c5c, #000);
}

.grid-item.yellow {
  background: radial-gradient(circle at 30px 30px, #ffef5c, #000);
}

.grid-item.orange {
  background: radial-gradient(circle at 30px 30px, #ff985c, #000);
}

.grid-item.green {
  background: radial-gradient(circle at 30px 30px, #82ff5c, #000);
}
</style>
