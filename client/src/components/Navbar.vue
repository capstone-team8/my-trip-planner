<template>
	<vs-navbar right-collapsed v-model="active">
		<template #left>
			<h3>
				My trip planner
			</h3>
		</template>
		<template #right>
			<vs-navbar-item :active="active == 'newPlan'" id="newPlan">
				New plan
			</vs-navbar-item>
			<vs-navbar-item :active="active == 'myPlans'" id="myPlans">
				My plans
			</vs-navbar-item>
			<vs-button flat>Login</vs-button>
			<vs-button>Register</vs-button>
		</template>
	</vs-navbar>
</template>

<script>
export default {
	data: function() {
		return {
			active: 'newPlan'
		}
	}
}
</script>

<style scoped>
.vs-navbar {
	font-family: 'Poppins', sans-serif;
}

.vs-navbar button {
	font-family: 'Poppins', sans-serif;
}
</style>
