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
		id: {
			default: undefined
		}
	}
}
</script>

<style></style>
