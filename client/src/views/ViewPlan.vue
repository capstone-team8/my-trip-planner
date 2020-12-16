<template>
	<my-plan :id="id" mode="view" />
</template>

<script>
import Plan from '../components/Plan'

export default {
	name: 'ViewPlan',
	components: {
		myPlan: Plan
	},
	props: {
		id: String
	}
}
</script>

<style scoped></style>
