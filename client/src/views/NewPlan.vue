<template>
	<div class="newPlan">
		<vs-row justify="center">
			<vs-col class="card" w="8" sm="11">
				<vs-row class="fullHeight">
					<vs-col class="fullHeight" w="6" sm="12">
						<vs-row class="fullHeight" align="center" justify="center">
							<PlanMaker class="planMaker" @locationFocused="onLocationFocused" @locationFocusCanceled="onLocationFocusCanceled" @addMarker="addMarker" />
						</vs-row>
					</vs-col>
					<vs-col class="fullHeight" w="6" sm="12">
						<vs-row class="fullHeight" align="center" justify="center">
							<Map class="map" :markers="markers" :markerFocused="markerFocused"/>
						</vs-row>
					</vs-col>
				</vs-row>
			</vs-col>
		</vs-row>
	</div>
</template>

<script>
import PlanMaker from '../components/PlanMaker'
import Map from '../components/Map'

export default {
	name: 'NewPlan',
	data: function() {
		return {
			markerFocused: undefined,
			markers: []
		}
	},
	components: {
		PlanMaker,
		Map
	},
	methods: {
		onLocationFocused(location) {
			this.markerFocused = location.geometry.location
		},
		onLocationFocusCanceled() {
			this.markerFocused = undefined
		},
		addMarker(location){
			this.markers.push({
				position: location.geometry.location,
				place_id: location.place_id,
				// + 마커 정보
			});
		}
	}
}
</script>

<style scoped>
.newPlan {
	margin-top: 100px;
}

.map,
.planMaker {
	width: 90%;
}

@media (min-width: 900px) {
	.card {
		height: 47em;
	}

	.map,
	.planMaker {
		height: 95%;
	}
}

@media (max-width: 900px) {
	.planMaker {
		margin-top: 1.5em;
		margin-bottom: 1.5em;
	}

	.map {
		height: 30em;
		margin-bottom: 1.5em;
	}
}

@media (max-width: 500px) {
	.planMaker {
		margin-top: 1em;
		margin-bottom: 1em;
	}

	.map {
		height: 20em;
		margin-bottom: 1em;
	}
}
</style>
