<template>
  <div class="container">
    <label> T1: 37.293974, 126.975431 </label>
    <vs-button class = "button-make" @click="setPlace({lat: 37.293974, lng: 126.975431})"> 마커 등록 </vs-button>
    <label> T2: 37.29, 126.97 </label>
    <vs-button class = "button-make" @click="setPlace({lat: 37.29, lng: 126.97})"> 마커 등록 </vs-button>
    <GmapMap
      ref="mapRef"
      :center="center"
      :zoom="16"
      style="width: 100%; height: 80%"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickabble="true"
        :draggable="true"
      />
    </GmapMap>
  </div>
</template>

<script>
export default {
  name: "Map",
  data() {
    return {
      // Test 좌표
      center: {
        lat: 37.293974,
        lng: 126.975431,
      },
      // Markers List
      markers: [],
    };
  },
  methods: {
    setPlace(place) {
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.panTo(place); // 맵 이동
        map.setZoom(17);
      });
        this.markers.push({
          position: place
        });
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.button-make {
	width: 100%;
	align-self: flex-end;
}
</style>
