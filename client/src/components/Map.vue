<template>
	<div class="container">
		<GmapMap ref="mapRef" :center="center" :zoom="16" style="width: 100%; height: 100%">
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
	name: 'Map',
	props: { markerFocused: Object },
	data() {
		return {
			// Test 좌표
			center: {
				lat: 37.293974,
				lng: 126.975431
			},
			// Markers List
			markers: []
		}
	},
	watch: {
		markerFocused: function() {
			if (this.markerFocused) {
				this.setPlace(this.markerFocused)
			} else {
        // TODO focus canceled
        console.log('focus canceled')
      }
		}
	},
	methods: {
		setPlace(place) {
			this.$refs.mapRef.$mapPromise.then((map) => {
				map.panTo(place) // 맵 이동
				map.setZoom(17)
			})
			this.markers.push({
				position: place
			})
		}
	}
}
</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
}
</style>
