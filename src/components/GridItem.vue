<template>
  <div
    :class="{ 'is-highlighted': isHighlighted }"
    :style="{ backgroundColor: color }"
    style="width: 85px; height: 85px"
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

.grid-item {
  // transition: background-color 250ms linear;
}
</style>
