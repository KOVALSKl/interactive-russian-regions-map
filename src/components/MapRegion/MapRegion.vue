<template>
  <g class="map-region">
    <slot
            name="map-region-component"
            :d="mainProps.d"
            @click="(event) => emit('regionClicked', {event, data})"
    >
      <path
              :id="`path_${data.properties.id}`"
              class="map-region-path"
              :d="mainProps.d"
              @click="(event) => emit('regionClicked', {event, data})"
      >
      </path>
    </slot>
  </g>
</template>

<script setup>
  const mainProps = defineProps(["d", "data"])
  const emit = defineEmits(['regionClicked'])
</script>

<style lang="scss">
  .map-region {
    & {
      transition: fill ease-in 200ms;
      fill: #444;
      cursor: pointer;

      z-index: 1;

      position: relative;
    }

    &:hover {
      fill: rgba(68, 68, 68, 0.7);
    }
  }
</style>