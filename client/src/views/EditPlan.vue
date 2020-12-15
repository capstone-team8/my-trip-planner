<template>
	<my-plan :id="id" mode="edit" />
</template>

<script>
import Plan from '../components/Plan'

export default {
	name: 'EditPlan',
	components: {
		myPlan: Plan
	},
	props: {
		id: String
	}
}
</script>

<style></style>
