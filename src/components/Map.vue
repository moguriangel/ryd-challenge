<template>
  <div class="map">
    <l-map 
      style="height: 500px"
      :zoom="mapInitValue.zoom"
      :center="mapInitValue.center"
      :zoomAnimation="true"
      :bounds="mapBounds">
      <l-tile-layer :url="mapInitValue.url" :attribution="mapInitValue.attribution"></l-tile-layer>
      <l-marker :lat-lng="mapInitValue.markerLatLng"></l-marker>
      <l-marker :lat-lng="stationPositionLatLng"></l-marker>
  </l-map>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, computed, ref } from 'vue';
import { GasStation } from '@/types';

import {
  LMap,
  LTileLayer,
  LMarker,
  LFeatureGroup,
  LControlLayers,
  LTooltip,
  LPopup,
} from "@vue-leaflet/vue-leaflet";

import { latLngBounds } from 'leaflet/dist/leaflet-src.esm';

import "leaflet/dist/leaflet.css";

export default defineComponent({
  name: 'Map',
  props: {
    position: {
      type: Array,
      required: true
    },
    stationPosition: {
      type: Array,
      default: () => []
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  setup(props) {
    const mapInitValue = reactive({
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      center: props.position,
      markerLatLng: props.position
    })

    const stationPositionLatLng = computed(() => [props.stationPosition[0], props.stationPosition[1]])

    const mapBounds = computed(() => stationPositionLatLng.value.length
      ? latLngBounds([
        props.position,
        stationPositionLatLng.value
      ])
      : props.position)
    return {
      mapInitValue,
      mapBounds,
      stationPositionLatLng
    }
  }
});
</script>
