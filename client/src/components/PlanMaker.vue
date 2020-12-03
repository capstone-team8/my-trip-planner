<template>
	<div class="flex-box">
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
							<div class="td-title" @click="toggleLocation(location)">
								{{ location.name }}
							</div>
							<div
								class="table-expand"
								v-if="locationFocused && locationFocused.place_id == location.place_id"
							>
								<div>
									<vs-avatar dark>
										<template #text>
											image
										</template>
									</vs-avatar>
								</div>
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
										<vs-button v-on:click="add(location, 'restaurant')" gradient danger icon>
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
										<vs-button v-on:click="add(location, 'bar')" gradient dark icon>
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
					<vs-tr :key="location.place_id" v-for="location in locationsSelected">
						<vs-td>
							{{ location.name }}
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
			this.locationsSelected.push(location)
		},
		// 서버에 Plan make request 전달
		create() {
			requestHandler
				.sendPutRequest('/plan/make', this.locationsSelected)
				.then((response) => {
					alert('성공')
					console.log(response)
				})
				.catch((error) => {
					alert('일정 생성에 실패했습니다. 다시 시도해주세요.')
					console.error(error)
				})
		},
		// 데이터 초기화
		resetData() {
			Object.assign(this.$data, this.$options.data())
		},
		back() {
			this.$emit('moveToFirst', this.locationsSelected)
		}
	},
	mounted: function() {
		if (this.locationsSelectedData) {
			this.locationsSelected = this.locationsSelectedData
		}
	}
}
</script>

<style scoped>
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
	cursor: pointer;
}
</style>
