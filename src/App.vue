<template>
  <h1 class="text-center">Cheapest Station around you</h1>
  <StationFilters :position="position" @stationPosition="changeStationPosition"/>
  <Map v-if="stationPosition?.length" :position="position" :stationPosition="stationPosition" stationId="123"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { GasStation } from '@/types';

import StationFilters from './components/StationFilters.vue';
import Map from './components/Map.vue';

const FAKE_POSITION = [48.129416, 11.592824]
export default defineComponent({
  name: 'App',
  components: {
    StationFilters,
    Map
  },
  setup() {
    const stationPosition = ref<number[] | null>(null)

    const changeStationPosition = (stationObject: GasStation) => {
      if (stationObject) {
        stationPosition.value = [stationObject.lat, stationObject.lng]
      }
    }
    return {
      position: FAKE_POSITION,
      changeStationPosition,
      stationPosition
    }
  }
});
</script>

<style lang="scss">
.text-center {
  text-align: center;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
