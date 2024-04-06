<script setup>
  import * as d3 from "d3"
  import {ref, onMounted, computed, watch, reactive, provide} from "vue"

  import MapRegion from "@/components/MapRegion/MapRegion.vue";

  const props = defineProps({
    width: {
      type: Number,
      default: 900
    },
    height: {
      type: Number,
      default: 900
    },
    mapData: {
      type: Object,
      required: true
    },
    mapDataIndexes: {
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
    },
    color: {
      type: String,
      default: "red"
    }
  })

  // EMITS
  const eventBusEmits = defineEmits([
      "nextRegion",
      "previousRegion",
      "regionClicked",
      "mapClicked"
  ])

  // CONSTANTS

  const mapDataFeaturesLength = props.mapData.features.length;
  const mapComponentTags = new Map();

  // COMPUTED

  const projection = computed(() => {
    return (props.mapProjection ?? d3.geoTransverseMercator()
        .fitSize([props.width, props.height], props.mapData)
        .rotate([-90, 0])
        .center([-20, -20]))
  })

  const currentRegion = computed(() => {
    return props.mapData.features[currentRegionIndex.value]
  })

  // REACTIVE

  const currentRegionIndex = ref(0);
  const path = ref(d3.geoPath().projection(projection.value));
  const zoom = ref(
      d3.zoom()
          .scaleExtent([1, 8])
          .on("zoom", zoomed)
  )
  const mapElement = ref(null);
  const mapBlueprintElement = ref(null);

  // WATCHERS

  watch(currentRegion, (newRegion, oldRegion) => {
    mapComponentTags.get(oldRegion.properties.id)?.style.setProperty("fill", null)
    mapComponentTags.get(newRegion.properties.id)?.style.setProperty("fill", props.color)
  })

  // METHODS

  function setRegionIndex(value) {
    if (value >= 0 && value < mapDataFeaturesLength) {
      currentRegionIndex.value = value
    }
  }

  function findRegionIndex(value) {
    for(let i = 0; i < mapDataFeaturesLength; i++) {
      if (props.mapData[i].properties.id === value.properties.id) {
        return i;
      }
    }
  }

  function getRegionIndex(value) {
    let regionId = value.properties.id
    return props.mapDataIndexes[regionId].index
  }

  function nextRegion() {
    setRegionIndex(++currentRegionIndex.value)
    invokeRegionClick()

    eventBusEmits("nextRegion")
  }

  function previousRegion() {
    setRegionIndex(--currentRegionIndex.value)
    invokeRegionClick()

    eventBusEmits("previousRegion")
  }

  function invokeRegionClick() {
    let regionId = currentRegion.value.properties.id
    let regionPathElement = mapComponentTags.get(regionId);
    regionPathElement.dispatchEvent(new PointerEvent("click", undefined))
  }

  function zoomed(event) {
    const {transform} = event;
    mapBlueprintElement.value.attr("transform", transform);
    mapBlueprintElement.value.attr("stroke-width", 1 / transform.k);
  }

  function reset() {
    mapElement.value.transition().duration(props.animationDurationTime).call(
        zoom.value.transform,
        d3.zoomIdentity,
        d3.zoomTransform(mapElement.value.node()).invert([props.width / 2, props.height / 2])
    )
  }

  function clicked({event, data}) {
    const [[x0, y0], [x1, y1]] = path.value.bounds(data);
    event.stopPropagation();

    console.log(x0, y0, x1, y1)

    let regionIndex;

    if (props.mapDataIndexes)
      regionIndex = getRegionIndex(data)
    else
      regionIndex = findRegionIndex(data)

    setRegionIndex(regionIndex)

    mapElement.value.transition().duration(props.animationDurationTime).call(
        zoom.value.transform,
        d3.zoomIdentity
            .translate(props.width / 2, props.height / 2)
            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / props.width, (y1 - y0) / props.height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
    )
  }

  onMounted(() => {
    mapElement.value = d3.select("svg")
        .on("click", reset)
        .call(zoom.value)

    mapBlueprintElement.value = d3.select("#regions-container");

    const tags = document.querySelectorAll("path.map-region-path").values();

    for(let tag of tags) {
      mapComponentTags.set(tag.parentElement.id, tag)
    }

    mapComponentTags.get(currentRegion.value.properties.id)?.style.setProperty("fill", props.color)
    invokeRegionClick();
  })

</script>

<template>
  <div class="map-provider-container">
    <slot
            name="map"
          :width="width"
          :height="height"
          :map-data="mapData"
          :path="path"
          @region-clicked="clicked"
    >
    </slot>
    <slot
            :current-region="currentRegion"
            @next-region="nextRegion"
            @previous-region="previousRegion"
    ></slot>
  </div>
</template>

<style scoped lang="scss">
  .map-provider-container {
    & {
      display: grid;
      grid-template-columns: 1fr 400px;
      align-items: center;
      column-gap: 20px;

      width: 100%;
    }
  }
</style>