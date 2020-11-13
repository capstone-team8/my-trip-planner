<template>
	<div class="container">
		<GmapMap ref="mapRef" :center="center" :zoom="16" style="width: 100%; height: 100%">
			<div v-for="(m, index) in markers" :key="index">
				<GmapMarker
					:icon="{url: require('../assets/'+m.type+'.png')}"
					:position="m.position"
					:clickabble="true"
					@click="setPlace(m.position)"
					:draggable="false"
				/>
			</div>
			<GmapMarker
				v-if="this.markerFocused!=undefined"
				icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
				:position= this.markerFocused
				:clickabble="true"
				:draggable="false"

			/>
		</GmapMap>
	</div>
</template>

<script>
export default {
	name: 'Map',
	props: { 
		markerFocused: Object,
		markers: Array,
	},
	data() {
		return {
			// Test Center 좌표
			center: {
				lat: 37.293974,
				lng: 126.975431
			},
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
			if(this.markers.length > 0){
				const bounds = new google.maps.LatLngBounds()
				for (let m of this.markers){
					bounds.extend(m.position)
				}
				bounds.extend(place)
				this.$refs.mapRef.fitBounds(bounds);
			}
			else{
				this.$refs.mapRef.$mapPromise.then((map) => {
				map.panTo(place); // 맵 이동
				map.setZoom(17);
				})
			}
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
