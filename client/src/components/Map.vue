<template>
	<div class="container">
		<GmapMap ref="mapRef" :center="{lat: 40.712391, lng: -74.007222}" :zoom="16" style="width: 100%; height: 100%">
			<div v-for="(m, index) in locationsSelected" :key="index">
				<GmapMarker
					v-if="m.type=='tour'"
					:label="{
						text: '🚎',
						fontSize: '30px'
					}"
					icon = "null"
					:position="m.geometry.location"
					:clickabble="false"
					:draggable="false"
				/>
				<GmapMarker
					v-if="m.type=='night'"
					:label="{
						text: '🌆',
						fontSize: '30px'
					}"
					icon = "null"
					:position="m.geometry.location"
					:clickabble="false"
					:draggable="false"
				/>
				<GmapMarker
					v-if="m.type=='restaurant'"
					:label="{
						text: '🍽️',
						fontSize: '30px'
					}"
					icon = "null"
					:position="m.geometry.location"
					:clickabble="false"
					:draggable="false"
				/>
				<GmapMarker
					v-if="m.type=='cafe'"
					:label="{
						text: '☕',
						fontSize: '30px'
					}"
					icon = "null"
					:position="m.geometry.location"
					:clickabble="false"
					:draggable="false"
				/>
				<GmapMarker
					v-if="m.type=='bar'"
					:label="{
						text: '🍷',
						fontSize: '30px'
					}"
					icon = "null"
					:position="m.geometry.location"
					:clickabble="false"
					:draggable="false"
				/>
			</div>
			<GmapMarker
				v-if="this.markerFocused!=undefined"
				:label="{
						text: '🏃',
						fontSize: '20px'
					}"
				icon = "null"
				:position= this.markerFocused
				:clickabble="false"
				:draggable="false"
			/>
		</GmapMap>
	</div>
</template>

<script>
import {gmapApi} from 'vue2-google-maps';

export default {
	name: 'Map',
	props: { 
		locationsSelected: Array,
		markerFocused: Object,
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
		},
	},
	methods: {
		showFocused() { // 마커 리스트 표시
			const bounds = new google.maps.LatLngBounds()
			if(this.locationsSelected.length > 1){
				for (let m of this.locationsSelected){
					bounds.extend(m.geometry.location)
				}
				this.$refs.mapRef.fitBounds(bounds);
			}
			else if(this.locationsSelected.length == 1){
				for (let m of this.locationsSelected){
					this.$refs.mapRef.$mapPromise.then((map) => {
						map.panTo(m.location); // 맵 이동
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
		showRoute(places){
			let wp=[];

			for(let place of places){
				wp.push({
					location: place.geometry.location,
					stopover: true
				})
			}

			this.$gmapApiPromiseLazy().then(() => {
				const _self = this;
				this.directionsService.route({
					origin: wp[0].location,
					destination: wp[wp.length-1].location,
					waypoints: wp.slice(1,wp.length-1),
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
