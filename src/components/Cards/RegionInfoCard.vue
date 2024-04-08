<script setup>
    const props = defineProps(['currentRegion'])
    const emits = defineEmits(['nextRegion', 'previousRegion'])
</script>

<template>
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

<style scoped>

</style>