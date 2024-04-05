<script setup>

  // Components
  import MapRegion from "@/components/MapRegion/MapRegion.vue";

  const props = defineProps({
    mapData: {
      type: Object,
      required: true
    },
    path: {
      type: Function,
      required: true,
    },
    width: {
      type: Number,
      default: 900
    },
    height: {
      type: Number,
      default: 900
    },
  })

  const emits = defineEmits(['regionClicked'])

</script>

<template>
  <div class="map-container w-100">
    <svg
            id="map"
            :width="props.width"
            :height="props.height"
            :viewBox="[0,0, props.width, props.height]"
    >
      <g id="regions-container">
        <map-region
                v-for="feature in mapData.features"
                :key="feature.properties.NAME_1"
                :id="feature.properties.id"
                :data="feature"
                :d="path(feature)"
                @region-clicked="(event) => emits('regionClicked', event)"
        >
        </map-region>
        <path fill="none" stroke="white" stroke-linejoin="round">
        </path>
      </g>
    </svg>
  </div>
</template>

<style lang="scss">
  .map-container {
    & {
      z-index: 10;
      min-width: 100%;

      display: flex;
      justify-content: center;
      gap: 20px;

      align-items: center;
    }

    @media screen and (max-width: 576px) {
      & {
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        justify-items: center;
      }
    }

    #map {
      max-width: 100%;
      height: auto;
    }
  }
</style>