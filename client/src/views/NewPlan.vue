<template>
	<div class="newPlan">
		<vs-row justify="center">
			<vs-col class="card" w="8" sm="11">
				<vs-row class="fullHeight">
					<vs-col class="fullHeight" w="6" sm="12">
						<vs-row class="fullHeight" align="center" justify="center">
							<PlanOptions v-if="page == 1" class="planMaker" @moveToSecond="moveToSecond" />
							<PlanMaker
								v-if="page == 2"
								class="planMaker"
								:planOptions="planOptions"
								:locationsSelectedData="locationsSelected"
								@locationFocused="onLocationFocused"
								@locationFocusCanceled="onLocationFocusCanceled"
								@moveToFirst="moveToFirst"
								@resetData="resetData"
								@planMade="onPlanMade"
							/>
							<PlanResult
								v-if="page == 3"
								class="planMaker"
								:planData="planData"
								@moveToSecond="moveToSecond"
								@locationFocused="onLocationFocused"
								@locationFocusCanceled="onLocationFocusCanceled"
								@selectDay="selectDay"
								@resetRoute="resetRoute"
							/>
						</vs-row>
					</vs-col>
					<vs-col class="fullHeight" w="6" sm="12">
						<vs-row class="fullHeight" align="center" justify="center">
							<Map 
								ref="map"
								class="map" 
								:locationsSelected="locationsSelected" 
								:markerFocused="markerFocused" 
							/>
						</vs-row>
					</vs-col>
				</vs-row>
			</vs-col>
		</vs-row>
	</div>
</template>

<script>
import PlanOptions from '../components/PlanOptions'
import PlanMaker from '../components/PlanMaker'
import PlanResult from '../components/PlanResult'
import Map from '../components/Map'

export default {
	name: 'NewPlan',
	data: function() {
		return {
			markerFocused: undefined,
			page: 1,
			planOptions: undefined,
			locationsSelected: [],
			planData: undefined,
		}
	},
	components: {
		PlanOptions,
		PlanMaker,
		PlanResult,
		Map
	},
	methods: {
		onLocationFocused(location) {
			this.markerFocused = location.geometry.location
		},
		onLocationFocusCanceled() {
			this.markerFocused = undefined
		},
		resetData(data){
			if (data && data.locationsSelected) {
				this.locationsSelected = data.locationsSelected
      			this.$refs.map.directionsDisplay.set('directions', null)
				this.markerFocused = undefined
			}
		},
		resetRoute(){
			this.$refs.map.directionsDisplay.set('directions', null)
		},
		moveToFirst(data) {
			this.page = 1
		},
		moveToSecond(data) {
			if (data) {
				if (data.planOptions) {
					this.planOptions = data.planOptions
				}

				if (data.locationsSelected) {
					this.locationsSelected = data.locationsSelected
				}
			}

			this.page = 2
		},
		onPlanMade(data) {
			if (data) {
				if (data.planData) {
					this.planData = data.planData
				}

				if (data.locationsSelected) {
					this.locationsSelected = data.locationsSelected
				}
			}

			this.page = 3
		},
		selectDay(plan){
			this.$refs.map.showRoute(plan)
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
