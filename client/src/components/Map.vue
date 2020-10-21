<template>
	<div class="container">
		<button @click="addMarker">마커 등록</button>
		<GmapMap ref="mapRef" :center="center" :zoom="16" style="width: 100%; height: 100%">
			<GmapMarker
				:key="index"
				v-for="(m, index) in markers"
				icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
				:position="m.position"
				:clickabble="true"
				:draggable="false"
			/>
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
	props: { markerFocused: Object },
	data() {
		return {
			// Test Center 좌표
			center: {
				lat: 37.293974,
				lng: 126.975431
			},
			// Markers List -> PlanMaker의 location과 통합?
			markers: [],
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
				map.panTo(place); // 맵 이동
				map.setZoom(17);
			})
		},
		addMarker(){
			if (this.markerFocused) {
       			this.markers.push({
          			position: this.markerFocused
					// + 마커 정보
				});
				this.markerFocused = undefined;
      		}

		}
		// markers 관련 setPlace 메소드만 있는데 선택된 마커 제거하는 메소드 추가
		//
		// markers에 여러개 마커가 있을때 해당 마커들을 모두 반영하여 auto zoom, auto center하게(하드코딩x)
		// -> plan 생성 이후
	}
}
</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
}
</style>
