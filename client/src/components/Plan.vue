<template>
	<div class="my-page">
		<vs-row justify="center">
			<vs-col class="card" w="8" sm="11">
				<vs-row class="fullHeight">
					<vs-col class="fullHeight" w="6" sm="12">
						<vs-row class="fullHeight" align="center" justify="center">
							<PlanOptions
								v-if="page == 1"
								class="planMaker"
								:planOptions="planOptions"
								@moveToSecond="moveToSecond"
							/>
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
								:planOptions="planOptions"
								:members="members"
								:planData="planData"
								:id="id"
								:mode="mode"
								@moveToSecond="moveToSecond"
								@locationFocused="onLocationFocused"
								@locationFocusCanceled="onLocationFocusCanceled"
								@selectRoute="selectRoute"
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

import requestHandler from '../utils/requestHandler'

export default {
	name: 'Plan',
	components: {
		PlanOptions,
		PlanMaker,
		PlanResult,
		Map
	},
	props: {
		id: {
			default: undefined
		},
		mode: {
			type: String,
			default: 'new'
		}
	},
	data: function() {
		return {
			markerFocused: undefined,
			page: 1,
			planOptions: {
				name: '새로운 일정',
				nights: 0,
				isHotel: 0
			},
			members: [{ name: this.$store.state.user.name, nickname: this.$store.state.user.nickname }],
			locationsSelected: [],
			planData: undefined
		}
	},
	created() {
		if (this.mode != 'new' && this.id) {
			this.page = 3

			// Read the plan data from the database
			requestHandler
				.sendGetRequestWithCredentials('/plan/auth', { id: this.id })
				.then((res) => {
					if (res.success && res.hasAuthority) {
						if (this.mode == 'edit' && !res.hasAuthority) {
							alert('소유한 일정만 편집할 수 있습니다.')
							this.$router.replace({ name: 'NewPlan' })
						}

						// Set data with response
						this.planOptions = res.planOptions
						this.members = res.members
						this.locationsSelected = res.locationsSelected
						this.planData = res.planData
					} else {
						alert('일정 정보를 읽을 수 없습니다.')
						this.$router.replace({ name: 'NewPlan' })
					}
				})
				.catch((err) => {
					alert('에러가 발생했습니다.')
					this.$router.replace({ name: 'NewPlan' })
				})
		}
	},
	methods: {
		onLocationFocused(location) {
			this.markerFocused = location.geometry.location
		},
		onLocationFocusCanceled() {
			this.markerFocused = undefined
		},
		resetData(data) {
			if (data && data.locationsSelected) {
				this.locationsSelected = data.locationsSelected
				this.$refs.map.directionsDisplay.set('directions', null)
				this.markerFocused = undefined
				this.$refs.map.showFocused()
			}
		},
		resetRoute() {
			this.$refs.map.directionsDisplay.set('directions', null)
			this.$refs.map.showFocused()
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
		selectRoute(plan) {
			this.$refs.map.showRoute(plan)
		}
	}
}
</script>

<style scoped>
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
