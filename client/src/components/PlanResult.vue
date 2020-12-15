<template>
	<div class="flex-box">
		<h2>
			<vs-row justify="space-between">
				{{ planOptions.name }}
				<vs-tooltip>
					<vs-button @click="resetRoute" gradient success icon>
						<i class="bx bxs-map-alt"></i>
					</vs-button>
					<template #tooltip>
						전체 지도 보기
					</template>
				</vs-tooltip>
			</vs-row>
		</h2>
		<vs-row class="contents">
			<vs-col>
				<vs-table v-for="places in planData" :key="planData.indexOf(places)">
					<template #header>
						<div class="table-header">
							<vs-row justify="space-between" align="center">
								{{ planData.indexOf(places) + 1 }}일차
								<vs-tooltip>
									<vs-button @click="selectRoute(places)" dark icon>
										<i class="bx bx-trip"></i>
									</vs-button>
									<template #tooltip>
										여행 루트 보기
									</template>
								</vs-tooltip>
							</vs-row>
						</div>
					</template>
					<template #tbody>
						<vs-tr
							v-for="place in places"
							:key="place.place_id"
							class="cursor-pointer"
							@click="toggleLocation(place)"
						>
							<vs-td>
								{{ place.name }}
							</vs-td>
						</vs-tr>
					</template>
				</vs-table>
				<vs-table>
					<template #header>
						여행 멤버
					</template>
					<template #tbody>
						<vs-tr>
							<vs-td>
								<vs-input v-model="searchUsername" placeholder="유저 아이디"></vs-input>
							</vs-td>
							<vs-td>
								<vs-button class="button-right" @click="addMember" icon>
									<i class="bx bx-plus"></i>
								</vs-button>
							</vs-td>
						</vs-tr>
						<vs-tr v-for="member in members" :key="member.name">
							<vs-td>
								{{ member.name }}
							</vs-td>
							<vs-td class="right">
								{{ member.nickname }}
							</vs-td>
						</vs-tr>
					</template>
				</vs-table>
			</vs-col>
		</vs-row>
		<vs-row justify="space-between">
			<vs-button icon dark @click="back">
				<i class="bx bx-arrow-back" />
			</vs-button>
			<vs-button @click="savePlan">
				일정 저장
			</vs-button>
		</vs-row>
	</div>
</template>

<script>
import requestHandler from '../utils/requestHandler'

export default {
	props: {
		planOptions: Object,
		planData: Array,
		members: Array,
		id: String,
		mode: String
	},
	data: function() {
		return {
			locationFocused: undefined,
			searchUsername: ''
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
		selectRoute(plan) {
			this.$emit('selectRoute', plan)
		},
		resetRoute() {
			this.$emit('resetRoute')
		},
		async addMember() {
			if (!this.searchUsername) {
				alert('유저 아이디를 입력해주세요.')
				return
			}

			try {
				// Find the user with the username
				const user = await requestHandler.sendGetRequest('/user', { name: this.searchUsername })
				this.searchUsername = ''

				if (!user) {
					alert('존재하지 않는 유저입니다.')
					return
				}

				// Check if the user already in members
				const newMember = { name: user.name, nickname: user.nickname }
				for (const member of this.members) {
					if (member.name == newMember.name) {
						alert('이미 추가된 유저입니다.')
						return
					}
				}

				// Can add the new member
				this.members.push(newMember)
			} catch (err) {
				alert('에러가 발생했습니다. 다시 시도해주세요.')
			}
		},
		savePlan() {
			let planInfo = {
				name: this.planOptions.name,
				days: this.planOptions.nights + 1,
				members: this.members,
				places: this.planData
			}
			if (this.mode == 'new') {
				requestHandler
					.sendPostRequest('/plan', planInfo)
					.then((response) => {
						if (response.success) {
							// 일정 저장 성공
							alert('일정 저장 성공')
						} else {
							alert('일정 저장에 실패했습니다. 다시 시도해주세요.')
						}
					})
					.catch((error) => {
						alert('오류가 발생했습니다. 다시 시도해주세요.')
						console.error(error)
					})
			} else if (this.mode == 'edit') {
				planInfo.id = this.id
				requestHandler
					.sendPutRequest('/plan', planInfo)
					.then((response) => {
						if (response.success) {
							// 일정 저장 성공
							alert('일정 저장 성공')
						} else {
							alert('일정 저장에 실패했습니다. 다시 시도해주세요.')
						}
					})
					.catch((error) => {
						alert('오류가 발생했습니다. 다시 시도해주세요.')
						console.error(error)
					})
			}
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

.button-right {
	float: right;
}
</style>
