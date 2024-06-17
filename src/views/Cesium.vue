<template>
  <div id="cesiumContainer" class="w-full h-screen absolute"></div>
  <div class="fixed top-4 left-4 z-10 flex flex-col space-y-2">
    <div class="flex space-x-2">
      <input
        v-model="address"
        type="text"
        placeholder="Enter address"
        class="p-2 border border-gray-300 rounded"
      />
      <MainButton label="Search" :icon="MagnifyingGlassIcon" @click="searchGeocode" />
      <MainButton label="Add waypoint" :icon="PlusIcon" @click="addWaypoint" />
    </div>
  </div>
  <div class="bg-gray-900 fixed text-white ml-4 mt-20 w-1/4 rounded shadow-lg">
    <h3 class="text-lg font-semibold w-full flex justify-center py-3">Waypoints on Map</h3>
    <div v-for="(waypoint, index) in waypoints" :key="index">
      <Card
        :name="waypoint.displayName"
        :lat="waypoint.lat"
        :lng="waypoint.lng"
        :alt="waypoint.altPoint - waypoint.altBottom"
        @deleteWaypoint="removeWaypoint(waypoint.id)"
        @updateAltWaypoint="updateAltWaypoint(waypoint.id, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium'
import Card from '../components/Card.vue'
import MainButton from '../components/MainButton.vue'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline'

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_APP_API_KEY_CESIUM

let viewer: Cesium.Viewer
const ALT_POINT_IN_METERS = 25

interface Waypoint {
  id: string
  displayName: string
  lat: number
  lng: number
  altPoint: number
  altBottom: number
}

const geocoderResult = ref<Waypoint | null>(null)
const address = ref<string>('')
const waypoints = ref<Waypoint[]>([])

async function initializeViewer(): Promise<void> {
  viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: await Cesium.createWorldTerrainAsync(),
    geocoder: false
  })

  try {
    const tileset = await Cesium.createGooglePhotorealistic3DTileset()
    viewer.scene.primitives.add(tileset)
  } catch (error) {
    console.log(`Failed to load tileset: ${error}`)
  }
}

onMounted(async () => {
  await initializeViewer()
})

async function searchGeocode(): Promise<void> {
  const query = address.value
  const googleMapsApiKey = import.meta.env.VITE_APP_API_KEY_GOOGLE_MAPS
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${googleMapsApiKey}`

  const geocodeResponse = await fetch(geocodeUrl)
  const geocodeData = await geocodeResponse.json()

  if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
    const result = geocodeData.results[0]
    const location = result.geometry.location

    const terrainProvider = viewer.terrainProvider
    const cartographic = Cesium.Cartographic.fromDegrees(location.lng, location.lat)

    const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, [cartographic])
    const altitudeBottom = Math.ceil(updatedPositions[0].height)

    const altitudePoint = altitudeBottom + ALT_POINT_IN_METERS

    geocoderResult.value = {
      id: '',
      displayName: result.formatted_address,
      lat: location.lat,
      lng: location.lng,
      altPoint: altitudePoint,
      altBottom: altitudeBottom
    }

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        location.lng,
        location.lat - 0.0025,
        altitudePoint + 150
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-30),
        roll: -0.0
      }
    })
  } else {
    console.log('Elevation error: No results found')
  }
}

function addWaypoint(): void {
  if (geocoderResult.value) {
    const entity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        geocoderResult.value.lng,
        geocoderResult.value.lat,
        geocoderResult.value.altPoint
      ),
      point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW
      },
      label: {
        text: geocoderResult.value.displayName,
        font: '14pt sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9)
      }
    })
    geocoderResult.value.id = entity.id
    console.log(geocoderResult.value)
    waypoints.value.push({
      ...geocoderResult.value
    })
  }
}

function updateAltWaypoint(id: string, newAlt: number): void {
  const entity = viewer.entities.getById(id)
  if (entity) {
    const waypoint = waypoints.value.find((wp) => wp.id === id)
    if (waypoint) {
      const adjustedAlt = waypoint.altBottom + newAlt
      const newDestination = Cesium.Cartesian3.fromDegrees(waypoint.lng, waypoint.lat, adjustedAlt)
      entity.position = new Cesium.ConstantPositionProperty(newDestination)

      waypoint.altPoint = adjustedAlt
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          waypoint.lng,
          waypoint.lat - 0.0025,
          adjustedAlt + 150
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-30),
          roll: -0.0
        }
      })
    }
  }
}

function removeWaypoint(id: string): void {
  const entity = viewer.entities.getById(id)
  if (entity) {
    viewer.entities.remove(entity)
    waypoints.value = waypoints.value.filter((waypoint) => waypoint.id !== id)
  } else {
    console.log(`Waypoint with id ${id} not found`)
  }
}
</script>

<style scoped></style>
