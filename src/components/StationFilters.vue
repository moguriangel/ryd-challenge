<template>
  <div class="station-filters">
    <div class="station-filters__section">
      <p>Choose Fuel Type</p>
      <select v-model="fuelTypeVModel" @change="fetchGasStations()">
        <option v-for="fuel in fuelTypes" :key="fuel">
          {{fuel}}
        </option>
      </select>
    </div>
    <div class="station-filters__section">
      <p>Choose Fuel Brand</p>
        <select v-model="brandVModel" @change="getStationsByBrand()">
          <option key="all">All</option>
          <option v-for="brand in brands" :key="brand">
            {{brand}}
          </option>
        </select>
    </div>
    <div v-if="stationToShow" class="station-filters__section">
     <strong>Name:</strong> {{stationToShow.name }} <br>
     <strong>Brand:</strong> {{stationToShow.brand }} <br>
     <strong>Address:</strong> {{stationToShow.street }} {{stationToShow.houseNumber }}, {{stationToShow.postCode }} {{stationToShow.place }} <br>
     <strong>Distance:</strong> {{stationToShow.dist }} km<br>
     <strong>Price:</strong> {{stationToShow.price }}  €<br>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, ComputedRef, onMounted, PropType } from 'vue';
import { uniq, sortBy } from 'lodash';

import { getGasStations } from '@/api/api'
import { GasStation } from '@/types';
import { GasStationListParams } from '@/api/types';

export default defineComponent({
  name: 'StationFilters',
  props: {
    position: {
      type: Array as PropType<number[]>,
      required: true
    }
  },
  emits: ['stationPosition'],
  setup(props, { emit }) {

    const fuelTypes = ['e5', 'e10', 'diesel']
    const fuelTypeVModel = ref(fuelTypes[0])

    /**
     * @name findCheapestNearestOpenGasStation
     * @description Find the open --> cheapest --> nearest gas station
     * @param {Array} stationsList
     */
    const findCheapestNearestOpenGasStation = (stationsList: GasStation[]) => {
      const openStations = stationsList.filter((station: GasStation) => station.isOpen)
      const cheapOpenNearStations = sortBy(openStations, ['price', 'dist'])
      return cheapOpenNearStations[0]
    }

    const gasStations = ref<GasStation[]>([])

    const cheapestAndNearestGasStation: ComputedRef<string[]> = computed(() =>
      findCheapestNearestOpenGasStation(gasStations.value)
    )
    /**
     * @name brands
     * @description retrive a list of all brands from API response and remove stations with no brand name
     */
    const brands: ComputedRef<string[]> = computed(() => {
      const gasStationsWithABrand = gasStations.value?.filter(station => station.brand !== '')
      return uniq(gasStationsWithABrand.map((station: GasStation) =>
        station?.brand
      ))
    });

    const brandVModel = ref('All')
    const stationsByBrand = ref<GasStation[]>([])
    const getStationsByBrand = (): void => {
      stationsByBrand.value = gasStations.value.filter((station: GasStation) =>
        station.brand === brandVModel.value)
    }

    const cheapestAndNearestStationByBrand = computed(() =>
      findCheapestNearestOpenGasStation(stationsByBrand.value)
    )

    const stationToShow: ComputedRef<GasStation> = computed(() => {
      const station = brandVModel.value === 'All'
        ? cheapestAndNearestGasStation.value
        : cheapestAndNearestStationByBrand.value
      emit('stationPosition', station)

      return station
    })

    const stationsParams: GasStationListParams = {
      lat: props.position[0],
      lng: props.position[1],
      rad: 30,
      sort: 'price',
      type: fuelTypeVModel.value,
      apikey: '00000000-0000-0000-0000-000000000002'
    }
    const fetchGasStations = async () => {
      const response = await getGasStations(stationsParams)
      const { data } = response
      !data.ok
        ? console.log('err')
        : gasStations.value = data.stations


    }
    onMounted(() => {
      fetchGasStations()
    })
    return {
      fuelTypes,
      fuelTypeVModel,
      brands,
      brandVModel,
      stationToShow,
      fetchGasStations,
      getStationsByBrand

    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.station-filters {
  &__section {
    border-bottom: 1px solid black;
    padding: 20px;
  }
}
</style>
