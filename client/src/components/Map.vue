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
		<button @click = "getRoute">Add route</button>
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
			directionsService:null,
			directionsDisplay:null,
			directionsDisplay:null
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
		
		},
		getRoute(){
			this.directionsService = new google.maps.DirectionsServic
			this.directionsDisplay = new google.maps.DirectionsRenderer()
			this.directionsDisplay.setMap(this.$refs.mapRef.$mapObject)
			var vm = this
			vm.directionsService.route({
				origin: '{lat:37.293974,lng:126.975431}', // Can be coord or also a search query 6.9271,79.8612
				destination:'{lat:37.5881865,lng:126.9925252}' ,//6.9934° N, 81.0550°
				travelMode: 'DRIVING'
			}, function (response, status) {
				if (status === 'OK') {
					vm.directionsDisplay.setDirections(response) // draws the polygon to the map
				} else {
					console.log('Directions request failed due to ' + status)
				}
			})
    	}
	},
}

</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
}

</style>
