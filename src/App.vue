<script setup>
    import {computed, ref} from "vue"
    import RegionsMap from "@/components/RegionsMap/RegionsMap.vue";
    import MapProvider from "@/providers/MapProvider/MapProvider.vue";
    import RegionInfoCard from "@/components/Cards/RegionInfoCard.vue"

    import regionsJSON from "/src/assets/map.json"
    import colorSchemaJSON from "/src/assets/colorSchema.json"
    import regionsIndexesJSON from "/src/assets/indexed_map.json"

    const emits = defineEmits(['nextRegion', 'previousRegion'])

    const colorSchema = ref(colorSchemaJSON)
    const regions = computed(() => regionsJSON)
    const regionsIndexes = computed(() => regionsIndexesJSON)

    const width = 720
    const height = 720

    function changeColors() {
        for (let region of Object.values(colorSchema.value)) {
            region.color = "blue"
        }
    }

</script>

<template>
    <div class="app-container">
        <header>
            <h2>Interactive Map</h2>
        </header>
        <main>
          <map-provider
              :map-data="regions"
              :map-data-indexes="regionsIndexes"
              :width="width"
              :height="height"
              :regionsColorSchema="colorSchema"
          >
              <template #map="props">
                  <regions-map v-bind="props"/>
              </template>
              <template v-slot="props">
                  <region-info-card v-bind="props"/>
              </template>
          </map-provider>
            <v-btn @click="changeColors">
                change colors
            </v-btn>
        </main>
        <footer>
            Map.json taken from <a href="https://gadm.org/download_country.html">GADM</a> &#128151;
        </footer>
    </div>
</template>

<style lang="scss">
    .app-container {
        & {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;

            padding: 2rem;
        }

        & .current-region-data-card {
            height: auto;
        }
    }
</style>
