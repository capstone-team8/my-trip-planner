<template>
	<div class="container">
		<GmapMap ref="mapRef" :center="center" :zoom="16" style="width: 100%; height: 100%">
			<div v-for="(m, index) in markers" :key="index">
				<GmapMarker
					icon="https://maps.gstatic.com/mapfiles/ms2/micons/blue-pushpin.png"
					:position="m.position"
					:clickabble="true"
					:draggable="false"
				/>
			</div>
			<GmapMarker
				v-if="this.markerFocused!=undefined"
				icon="https://maps.gstatic.com/mapfiles/ms2/micons/red-pushpin.png"
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
		// 순서리스트 추가
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
				this.setFocused(this.markerFocused)
			} else {
				this.showFocused()
     		}
		}
	},
	methods: {
		showFocused() { // 마커 리스트 표시
			const bounds = new google.maps.LatLngBounds()
			if(this.markers.length >1){
				for (let m of this.markers){
					bounds.extend(m.position)
				}
				this.$refs.mapRef.fitBounds(bounds);
			}
			else if(this.markers.length == 1){
				for (let m of this.markers){
					this.$refs.mapRef.$mapPromise.then((map) => {
						map.panTo(m.position); // 맵 이동
						map.setZoom(17);
					})
				}
			}
			
		},
		setFocused(place){ // 마커 하나 표시
			this.$refs.mapRef.$mapPromise.then((map) => {
				map.panTo(place); // 맵 이동
				map.setZoom(17);
			})
		},
		addRoute(){ // 루트 표시 함수
		
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
