<template>
	<div class="flex-box">
		<h2>
			여행 장소 등록
		</h2>
		<vs-input icon-after v-model="searchInput" @keyup.enter="search" placeholder="장소 검색">
			<template #icon>
				<i class="bx bx-search" />
			</template>
		</vs-input>
		<div class="tables">
			<vs-table class="table-search">
				<template #header>
					검색 결과
				</template>
				<template #notFound>
					방문할 장소를 검색해주세요.
				</template>
				<template v-if="locations.length" #tbody>
					<vs-tr :key="location.place_id" v-for="location in locations">
						<vs-td>
							<div class="td-title cursor-pointer" @click="toggleLocation(location)">
								{{ location.name }}
							</div>
							<div
								class="table-expand"
								v-if="locationFocused && locationFocused.place_id == location.place_id"
							>
								<div class="table-expand-buttons">
									<vs-tooltip>
										<vs-button v-on:click="add(location, 'tour')" gradient success icon>
											<i class="bx bxs-map"></i>
										</vs-button>
										<template #tooltip>
											관광지
										</template>
									</vs-tooltip>
									<vs-tooltip>
										<vs-button v-on:click="add(location, 'night')" gradient primary icon>
											<i class="bx bxs-moon"></i>
										</vs-button>
										<template #tooltip>
											야경
										</template>
									</vs-tooltip>
									<vs-tooltip>
										<vs-button v-on:click="add(location, 'restaurant')" gradient color="#ff3399" icon>
											<i class="bx bx-restaurant"></i>
										</vs-button>
										<template #tooltip>
											식당
										</template>
									</vs-tooltip>
									<vs-tooltip>
										<vs-button v-on:click="add(location, 'cafe')" gradient warn icon>
											<i class="bx bxs-coffee-alt"></i>
										</vs-button>
										<template #tooltip>
											카페
										</template>
									</vs-tooltip>
									<vs-tooltip>
										<vs-button v-on:click="add(location, 'bar')" gradient color="#7d33ff" icon>
											<i class="bx bxs-drink"></i>
										</vs-button>
										<template #tooltip>
											바
										</template>
									</vs-tooltip>
								</div>
							</div>
						</vs-td>
					</vs-tr>
				</template>
			</vs-table>
			<vs-table>
				<template #header>
					등록된 여행지
				</template>
				<template #notFound>
					여행할 장소를 등록해주세요.
				</template>
				<template #tbody>
					<vs-tr :key="location.place_id" v-for="location in locationsSelected" class="cursor-pointer" @click="toggleLocation(location)">
						<vs-td>
							{{ location.name }}
						</vs-td>
						<vs-td style="text-align: right;">
							<i class="bx bx-x" @click="deleteLocation(location)" />
						</vs-td>
					</vs-tr>
				</template>
			</vs-table>
		</div>
		<vs-row justify="space-between" class="button-row">
			<vs-button icon dark @click="back">
				<i class="bx bx-arrow-back" />
			</vs-button>
			<div class="button-group">
				<vs-button danger @click="resetData">
					초기화
				</vs-button>
				<vs-button v-on:click="create" gradient>
					<i class="bx bxs-magic-wand" /> 일정 생성
				</vs-button>
			</div>
		</vs-row>
	</div>
</template>

<script>
import requestHandler from '../utils/requestHandler'

const searchFailText = '검색에 실패했습니다. 다시 시도해주세요.'

export default {
	data: function() {
		return {
			searchInput: '',
			locations: [],
			locationsSelected: [],
			locationFocused: undefined
		}
	},
	props: {
		planOptions: Object,
		locationsSelectedData: Array
	},
	methods: {
		search() {
			// 테이블 초기화
			this.locations = []
			if (this.locationFocused) this.$emit('locationFocusCanceled')

			if (!this.searchInput.length) return

			requestHandler
				.sendGetRequest('/location/search', { text: this.searchInput })
				.then((response) => {
					this.locations = response.locations

					if (!this.locations.length) {
						alert(searchFailText)
					}
				})
				.catch((error) => {
					alert('검색에 실패했습니다. 다시 시도해주세요.')
					console.error(error)
				})
		},
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
		add(location, place) {
			var dup = false
			if (this.locationsSelected.length != 0) {
				// 중복 검사
				for (var el of this.locationsSelected) if (!el.place_id.indexOf(location.place_id)) return
			}

			location.type = place
			this.$emit('addMarker', location)
			this.locationsSelected.push(location)
		},
		deleteLocation(location) {
			const i = this.locationsSelected.indexOf(location)
			if (i >= 0) {
				this.locationsSelected.splice(i, 1)
				this.$emit('deleteMarker')
			}
		},
		// 서버에 Plan make request 전달
		create() {
			const days = this.planOptions.nights + 1
			requestHandler
				.sendPutRequest('/plan/make', {
					places: this.locationsSelected,
					days: days
				})
				.then((response) => {
					// 일정생성 성공
					this.$emit('planMade', {planData: response, locationsSelected: this.locationsSelected})
				})
				.catch((error) => {
					alert('일정 생성에 실패했습니다. 다시 시도해주세요.')
					console.error(error)
				})
		},
		// 데이터 초기화
		resetData() {
			Object.assign(this.$data, this.$options.data())
			this.$emit('resetData', {locationsSelected: this.locationsSelected})
		},
		back() {
			this.$emit('moveToFirst', {locationsSelected: this.locationsSelected})
		}
	},
	mounted() {
		if (this.locationsSelectedData) {
			this.locationsSelected = this.locationsSelectedData
		}
	}
}
</script>

<style scoped>
h2 {
	text-align: left;
	margin-top: 0;
}

.vs-table-content {
	margin-top: 1em;
}

.flex-box {
	display: flex;
	flex-direction: column;
}

.vs-input-parent {
	align-self: baseline;
}

.tables {
	flex-grow: 1;
	overflow: auto;
}

.button-group {
	display: flex;
	flex-direction: row;
}

.button-row {
	margin-top: 1rem;
}

td {
	text-align: left;
}

.table-expand {
	display: flex;
	justify-content: space-between;
	padding: 10px 12px;
}

.table-expand-buttons {
	display: flex;
}

.table-search .vs-table__td {
	padding: 0;
}

.td-title {
	padding: 10px 12px;
}
</style>
