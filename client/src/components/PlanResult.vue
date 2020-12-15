<template>
	<div class="flex-box">
		<h2>
			생성된 여행 일정
		</h2>
		<vs-row class="contents">
			<vs-col>
				<vs-table v-for="places in planData" :key="planData.indexOf(places)">
					<template #header>
						<div class="table-header">{{ planData.indexOf(places) + 1 }}일차</div>
					</template>
					<template #tbody>
						<vs-tr v-for="place in places" :key="place.place_id" class="cursor-pointer" @click="toggleLocation(place)">
							<vs-td>
								{{ place.name }}
							</vs-td>
						</vs-tr>
						<vs-button v-on:click="selectRoute(places)" gradient>
							루트 표시
						</vs-button>
					</template>
				</vs-table>
				<vs-button v-on:click="resetRoute()" danger>
					루트 제거
				</vs-button>
			</vs-col>
		</vs-row>
		<vs-row justify="space-between">
			<vs-button icon dark @click="back">
				<i class="bx bx-arrow-back" />
			</vs-button>
			<vs-button disabled>
				일정 저장
			</vs-button>
		</vs-row>
	</div>
</template>

<script>
export default {
	props: {
		planData: Array
	},
	data: function() {
		return {
			locationFocused: undefined
		}
	},
	methods: {
		// 주소 row를 선택했을 때 마커를 토글
		toggleLocation(location) {
			if (this.locationFocused && this.locationFocused.place_id == location.place_id) {
				this.locationFocused = undefined
				this.$emit('locationFocusCanceled')
			} else {
				this.locationFocused = location
				this.$emit('locationFocused', this.locationFocused)
			}
		},
		back() {
			this.$emit('moveToSecond')
		},
		selectRoute(plan){
			this.$emit('selectRoute',plan)
		},
		resetRoute(){
			this.$emit('resetRoute')
		}
	}
}
</script>

<style scoped>
div {
	text-align: left;
}

.vs-table-content {
	margin-bottom: 1rem;
}

.table-header {
	text-align: center;
}

h2 {
	margin-top: 0;
}

.flex-box {
	display: flex;
	flex-direction: column;
}

.contents {
	flex-grow: 1;
	overflow: auto;
}
</style>
