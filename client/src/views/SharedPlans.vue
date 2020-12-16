<template>
	<vs-row class="my-page" justify="center">
		<vs-col w="7" sm="11">
			<vs-row>
				<vs-col w="6" xs="12" v-for="plan in plans" :key="plan.id">
					<vs-row justify="center">
						<vs-col w="11" xs="12">
							<my-plan-card class="my-plan-card" :hasAuthority="false" :plan="plan" />
						</vs-col>
					</vs-row>
				</vs-col>
			</vs-row>
		</vs-col>
	</vs-row>
</template>

<script>
import PlanCard from '../components/PlanCard'

import requestHandler from '../utils/requestHandler'

export default {
	name: 'SharedPlans',
	components: {
		myPlanCard: PlanCard
	},
	data: function() {
		return {
			plans: []
		}
	},
	created() {
		// Get the shared plan lists
		requestHandler
			.sendGetRequest('/plan', { isShared: 1 })
			.then((res) => {
				if (res) this.plans = res
			})
			.catch((err) => {
				console.error(err)
				alert('에러가 발생했습니다.')
			})
	}
}
</script>

<style scoped>
.my-page {
	text-align: left;
	word-break: keep-all;
}

.my-plan-card {
	margin-bottom: 2rem;
}
</style>
