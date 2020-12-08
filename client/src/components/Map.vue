<template>
	<div class="container">
		<GmapMap ref="mapRef" :center="{lat: 37.293974, lng: 126.975431}" :zoom="16" style="width: 100%; height: 100%">
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
		<button @click = "showRoute()">Add route</button>
	</div>
</template>

<script>
import {gmapApi} from 'vue2-google-maps';

export default {
	name: 'Map',
	props: { 
		markerFocused: Object,
		markers: Array,
		// 순서리스트 추가
	},
	data() {
		return {
			directionsService: null,
      		directionsDisplay: null
		};
	},
	mounted() {
    	this.$gmapApiPromiseLazy().then(() => {
			const _self = this;
			this.directionsService = new google.maps.DirectionsService();
			this.directionsDisplay = new google.maps.DirectionsRenderer({
				map: this.$refs.mapRef.$mapObject,
			});
        });
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
		showRoute(){
			this.$gmapApiPromiseLazy().then(() => {
				const _self = this;
				this.directionsService.route({
					origin: {lat:41.8902102, lng:12.4922309},
					destination: {lat:41.8991632, lng:12.4730739},
					travelMode: 'DRIVING',
				}, (response, status) => {
					if (status === 'OK') {
						_self.directionsDisplay.setDirections(response);
					} else {
						window.alert('Directions request failed due to ' + status);
					}
				})
			});
        },
	},
}

</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
}

</style>
