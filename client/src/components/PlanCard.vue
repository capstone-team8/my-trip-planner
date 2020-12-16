<template>
	<vs-card type="3" @click="viewPlan">
		<template #title>
			<h3>
				{{ plan.name }}
			</h3>
		</template>
		<template #img>
			<img :src="imgSrc" alt="여행 샘플 이미지" />
		</template>
		<template #text>
			<br />
			<p class="card-text">
				<span v-for="member in plan.members" :key="member">{{ member }}님 </span>의
				{{ plan.days - 1 }}박{{ plan.days }}일 여행일정
			</p>
		</template>
		<template #interactions v-if="hasAuthority">
			<vs-tooltip shadow>
				<vs-button danger gradient icon @click.stop="sharePlan">
					<i class="bx bxs-share"></i>
				</vs-button>
				<template #tooltip>
					일정 공개하기
				</template>
			</vs-tooltip>
			<vs-button shadow primary icon @click.stop="editPlan">
				<i class="bx bxs-edit"></i>
			</vs-button>
		</template>
	</vs-card>
</template>

<script>
import imageUrls from '../assets/imageUrls'

import requestHandler from '../utils/requestHandler'

export default {
	name: 'PlanCard',
	props: {
		hasAuthority: {
			type: Boolean,
			default: false
		},
		plan: {
			type: Object,
			default: {
				name: '여행 일정',
				days: 1,
				members: []
			}
		}
	},
	data: function() {
		return {
			imgSrc: ''
		}
	},
	mounted() {
		// Generate random imgSrc
		const i = Math.floor(Math.random() * imageUrls.length)
		this.imgSrc = imageUrls[i]
	},
	methods: {
		viewPlan() {
			this.$router.push({ name: 'ViewPlan', params: { id: this.plan.id } })
		},
		editPlan() {
			this.$router.push({ name: 'EditPlan', params: { id: this.plan.id } })
		},
		async sharePlan() {
			if (this.plan.isShared) {
				alert('이미 공개된 일정입니다.')
			} else {
				// Set the plan's isShared value as true
				const res = await requestHandler.sendPutRequest('/plan/is-shared', { id: this.plan.id })
				if (res.success) {
					alert('일정이 공개되었습니다.')
				} else {
					alert('일정 공개 처리에 실패했습니다.')
				}
			}
		}
	}
}
</script>

<style scoped>
.card-text {
	min-width: 150px;
}
</style>
