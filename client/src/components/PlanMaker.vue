<template>
	<div class="flex-box">
		<vs-input icon-after v-model="searchInput" @keyup.enter="search" placeholder="장소 검색">
			<template #icon>
				<i class="bx bx-search" />
			</template>
		</vs-input>
		<div class="tables">
			<vs-table>
				<template #header>
					검색 결과
				</template>
				<template #notFound>
					방문할 장소를 검색해주세요.
				</template>
				<template v-if="locations.length" #tbody>
					<vs-tr :key="location.place_id" v-for="location in locations">
						<vs-td @click="toggleLocation(location)">
							{{ location.name }}
						</vs-td>
						<template #expand>
							<div class="table-expand">
								<div>
									<vs-avatar dark>
										<template #text>
											image
										</template>
									</vs-avatar>
								</div>
								<div class="table-expand-buttons">
									<vs-tooltip>
										<vs-button v-on:click="add(location, 'area')" gradient success icon>
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
						</template>
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
		<vs-button class="button-make" v-on:click="create(locationsSelected)" flat :active="true">
			일정 생성
		</vs-button>
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
			locationFocused: undefined,
			rowsExpanded: []
		}
	},
	methods: {
		search() {
			// 테이블 초기화
			this.locations = []
			this.rowsExpanded = []
			if (this.locationFocused) this.$emit('locationFocusCanceled')

			if (!this.searchInput.length) return

			requestHandler
				.sendRequest(this.searchInput)
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
			const index = this.rowsExpanded.indexOf(location.place_id)

			if (index >= 0) {
				// expand 됐던 row를 취소하는경우
				// rowsExpanded에서 현재 row 삭제
				this.rowsExpanded.splice(index, 1)

				// 현재 focus인 경우 focus 삭제
				if (this.locationFocused && this.locationFocused.place_id === location.place_id) {
					this.locationFocused = undefined
					this.$emit('locationFocusCanceled')
				}
			} else {
				// 새 row를 expand, focus 하는 경우
				this.rowsExpanded.push(location.place_id)
				this.locationFocused = location

				this.$emit('locationFocused', this.locationFocused)
			}
		},
		add(location, place) {
			var dup = false
			if (this.locationsSelected.length != 0) {
				for (var i = 0; i < this.locationsSelected.length; i++) {
					if (!this.locationsSelected[i].place_id.indexOf(location.place_id)) {
						dup = true
						break
					}
				}
				if (dup == false) {
					this.locationsSelected.push(location)
					this.locationsSelected[this.locationsSelected.length - 1].field = place
				}
			} else {
				this.locationsSelected.push(location)
				this.locationsSelected[this.locationsSelected.length - 1].field = place
			}
		},
		create(locationsSelected) {}
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

.button-make {
	width: 7em;
	align-self: flex-end;
}

td {
	text-align: left;
}

.table-expand {
	display: flex;
	justify-content: space-between;
}

.table-expand-buttons {
	display: flex;
}
</style>
