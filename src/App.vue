<script setup>
    import {computed} from "vue"
    import RegionsMap from "@/components/RegionsMap/RegionsMap.vue";
    import MapProvider from "@/providers/MapProvider/MapProvider.vue";

    import regionsJSON from "/src/assets/map.json"
    import regionsIndexesJSON from "/src/assets/indexed_map.json"
    import {he} from "vuetify/locale";

    const emits = defineEmits(['nextRegion', 'previousRegion'])

    const regions = computed(() => regionsJSON)
    const regionsIndexes = computed(() => regionsIndexesJSON)

    const width = 720
    const height = 720
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
          >
              <template #map="props">
                  <regions-map v-bind="props"/>
              </template>
              <template v-slot="props">
                  <v-card v-bind="props" class="current-region-data-card" elevation="2">
                      <v-card-title>{{props.currentRegion.properties.NAME_1}}</v-card-title>
                      <v-card-text>{{props.currentRegion.properties}}</v-card-text>
                      <v-card-actions v-bind="props">
                          <v-spacer/>
                          <v-btn @click="emits('previousRegion')">Previous</v-btn>
                          <v-btn @click="emits('nextRegion')">Next</v-btn>
                      </v-card-actions>
                  </v-card>
              </template>
          </map-provider>
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
