<template>
	<div class="flex-box">
		<vs-input icon-after v-model="searchInput" placeholder="장소 검색">
			<template #icon>
				<i class="bx bx-search" />
			</template>
		</vs-input>
		<div class="tables">
			<vs-table v-model="selected">
				<template #header>
					검색 결과
				</template>
				<template #notFound>
					방문할 장소를 검색해주세요.
				</template>
				<template #tbody>
					<vs-tr :key="location.id" v-for="location in locations" v-if="location.name.includes(searchInput) && searchInput!=''">
						<vs-td>
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
										<vs-button v-on:click="add(location, '관광지')" gradient success icon>
											<i class="bx bxs-map"></i>
										</vs-button>
										<template #tooltip>
											관광지
										</template>
									</vs-tooltip>
									<vs-tooltip>
										<vs-button v-on:click="add(location, '야경')" gradient primary icon>
											<i class="bx bxs-moon"></i>
										</vs-button>
										<template #tooltip>
											야경
										</template>
									</vs-tooltip>
									<vs-tooltip>
										<vs-button v-on:click="add(location, '식당')" gradient danger icon>
											<i class="bx bx-restaurant"></i>
										</vs-button>
										<template #tooltip>
											식당
										</template>
									</vs-tooltip>
									<vs-tooltip>
										<vs-button v-on:click="add(location, '카페')" gradient warn icon>
											<i class="bx bxs-coffee-alt"></i>
										</vs-button>
										<template #tooltip>
											카페
										</template>
									</vs-tooltip>
									<vs-tooltip>
										<vs-button v-on:click="add(location, '바')" gradient dark icon>
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
					<vs-tr :key="location.id" v-for="location in locationsSelected">
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
import dummyLocations from '../../data/dummyLocations'

export default {
	data: function() {
		return {
			searchInput: '',
			selected: [],
			locations: dummyLocations,
			locationsSelected: []
		}
	},
	methods: {
		add(location, place) {
			var dup=false
			if(this.locationsSelected.length!=0){
				for(var i=0;i<this.locationsSelected.length;i++){
					if(!this.locationsSelected[i].id.indexOf(location.id)){
						dup=true
						break
					}
				}
				if(dup==false){
					this.locationsSelected.push(location)
				}
			}
			else{
				this.locationsSelected.push(location)
			}
		},
		create(locationsSelected){

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
