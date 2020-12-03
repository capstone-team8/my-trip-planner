<template>
	<div class="flex-box">
		<vs-row class="contents">
			<vs-col>
				<h2>
					새 일정 만들기
				</h2>
				<vs-table>
					<template #header>
						<div class="table-header">
							여행 정보
						</div>
					</template>
					<template #tbody>
						<vs-tr>
							<vs-td>
								며칠동안 여행하나요?
							</vs-td>
							<vs-td>
								<vs-row align="center">
									<vs-input type="number" v-model="nights" class="input-nights" />
									<span> 박 {{ parseInt(nights) + 1 }}일 </span>
								</vs-row>
							</vs-td>
						</vs-tr>
						<vs-tr>
							<vs-td>
								숙소를 정했나요?
							</vs-td>
							<vs-td>
								<vs-row>
									<vs-radio v-model="isHotel" val="1" disabled>
										네
									</vs-radio>
									<vs-radio v-model="isHotel" val="0">
										아니오
									</vs-radio>
								</vs-row>
							</vs-td>
						</vs-tr>
					</template>
				</vs-table>
			</vs-col>
		</vs-row>
		<vs-row justify="flex-end">
			<vs-button @click="proceed" icon>
				<i class="bx bx-right-arrow-alt" /> 장소 등록
			</vs-button>
		</vs-row>
	</div>
</template>

<script>
export default {
	data: function() {
		return {
			nights: 2,
			isHotel: 0
		}
	},
	methods: {
		proceed() {
			this.$emit('moveToSecond', {nights: parseInt(this.nights)})
		}
	}
}
</script>

<style scoped>
div {
	text-align: left;
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
}

.card-border {
	padding: 1rem;
}

.vs-table__td {
	font-size: 0.9rem;
}
</style>
<style>
.input-nights .vs-input {
	width: 4rem;
	margin-right: 0.3rem;
}
</style>
