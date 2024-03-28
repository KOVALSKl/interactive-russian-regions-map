<script setup>
  import * as d3 from "d3"
  import { ref, onMounted, computed, watch, reactive } from "vue"

  // Components
  import MapRegion from "@/components/MapRegion/MapRegion.vue";
  import RegionInfo from "@/components/Cards/RegionInfo/RegionInfo.vue"

  const props = defineProps({
    width: {
      type: Number,
      default: 900
    },
    height: {
      type: Number,
      default: 900
    },
    regions: {
      type: Object,
      required: true
    },
    regionsIndexes: {
      type: Object,
      default: null
    },
    mapProjection: {
      type: Object,
      default: null
    },
    animationDurationTime: {
      type: Number,
      default: 1500
    }
  })

  const emits = defineEmits(['nextRegion', 'previousRegion'])

  const mapDataFeaturesLength = props.regions.features.length
  let tags = [];
  let tagsMap = new Map();

  const projection = computed(() => {
    return (props.mapProjection ?? d3.geoTransverseMercator()
            .fitSize([props.width, props.height], props.regions)
            .rotate([-90, 0])
            .center([-20, -20]))
  })

  const currentRegionIndex = ref(0)
  const path = ref(d3.geoPath().projection(projection.value))
  const transform = ref(null)
  const zoom = ref(null)
  const map = ref(null)
  const g = ref(null)

  const regionsHTMlTags = ref(null)

  const currentRegion = computed(() => {
    return props.regions.features[currentRegionIndex.value]
  })

  watch(currentRegionIndex, (newValue, oldValue) => {
    console.log(`index was changed ${newValue}`)
    currentRegion.value = props.regions.features[newValue]
  })

  watch(currentRegion, (newRegion, oldRegion) => {
    tagsMap.get(oldRegion.properties.id)?.style.setProperty("fill", null)
    tagsMap.get(newRegion.properties.id)?.style.setProperty("fill", "red")
  })

  function setRegionIndex(value) {
    if (value >= 0 && value < mapDataFeaturesLength) {
      currentRegionIndex.value = value
      console.log(`value updated: ${currentRegionIndex.value}`)
    }
  }

  function findRegionIndex(value) {
    for(let i = 0; i < mapDataFeaturesLength; i++) {
      if (props.regions[i].properties.id === value.properties.id) {
        return i;
      }
    }
  }

  function getRegionIndex(value) {
    let regionId = value.properties.id
    return props.regionsIndexes[regionId].index
  }

  function nextRegion() {
    console.log("clicked next")
    setRegionIndex(++currentRegionIndex.value)
    console.log(currentRegionIndex.value)
    invokeRegionClick()

    emits("nextRegion")
  }

  function previousRegion() {
    console.log("clicked previous")
    setRegionIndex(--currentRegionIndex.value)
    console.log(currentRegionIndex.value)
    invokeRegionClick()

    emits("previousRegion")
  }

  function invokeRegionClick() {
    let regionId = currentRegion.value.properties.id
    let regionPathElement = tagsMap.get(regionId);
    regionPathElement.dispatchEvent(new PointerEvent("click", undefined))
  }

  function zoomed(event) {
    const {transform} = event;
    g.value.attr("transform", transform);
    g.value.attr("stroke-width", 1 / transform.k);
  }

  function reset() {
    map.value.transition().duration(props.animationDurationTime).call(
        zoom.value.transform,
        d3.zoomIdentity,
        d3.zoomTransform(map.value.node()).invert([props.width / 2, props.height / 2])
    );
  }

  function clicked({event, data}) {
    console.log(event);
    const [[x0, y0], [x1, y1]] = path.value.bounds(data);
    event.stopPropagation();

    let regionIndex;

    console.log(data)
    if(props.regionsIndexes)
      regionIndex = getRegionIndex(data)
    else
      regionIndex = findRegionIndex(data)

    console.log(regionIndex)
    setRegionIndex(regionIndex)

    map.value.transition().duration(props.animationDurationTime).call(
        zoom.value.transform,
        d3.zoomIdentity
            .translate(props.width / 2, props.height / 2)
            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / props.width, (y1 - y0) / props.height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
    )
  }

  onMounted(() => {
    zoom.value = d3.zoom()
            .scaleExtent([1, 8])
            .on("zoom", zoomed)

    map.value = d3.select("svg")
        .on("click", reset)
        .call(zoom.value)

    tags = document.querySelectorAll("path.map-region-path").values();

    for (let tag of tags) {
      tagsMap.set(tag.parentElement.id, tag)
    }

    g.value = d3.select("#regions-container")

    invokeRegionClick();
  })

</script>

<template>
  <div class="map-container w-100">
    <svg
            id="map"
            :width="props.width"
            :height="props.height"
            :transform="transform"
    >
      <g id="regions-container">
        <map-region
                v-for="feature in regions.features"
                :key="feature.properties.NAME_1"
                :id="feature.properties.id"
                ref="regionsRef"
                :data="feature"
                :d="path(feature)"
                @region-clicked="clicked"
        >
        </map-region>
        <path fill="none" stroke="white" stroke-linejoin="round">
        </path>
      </g>
    </svg>
    <slot
            :region-data="currentRegion"
            @next-region="nextRegion"
            @previous-region="previousRegion"
    >
    </slot>
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