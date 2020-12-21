<template>
	<vs-navbar center-collapsed v-model="active">
		<template #left>
			<h3 @click="routerPush('NewPlan')">
				My trip planner
			</h3>
		</template>
		<vs-navbar-item
			:active="this.$route.name == 'NewPlan'"
			id="newPlan"
			@click="routerPush('NewPlan')"
		>
			New plan
		</vs-navbar-item>
		<vs-navbar-item
			:active="this.$route.name == 'MyPlans'"
			id="myPlans"
			@click="routerPush('MyPlans')"
		>
			My plans
		</vs-navbar-item>
		<vs-navbar-item
			:active="this.$route.name == 'SharedPlans'"
			id="sharedPlans"
			@click="routerPush('SharedPlans')"
		>
			Shared plans
		</vs-navbar-item>
		<template #right>
			<span class="nickname">
				{{ nickname }}
			</span>
			<vs-button flat @click="logout">Logout</vs-button>
		</template>
	</vs-navbar>
</template>

<script>
import { logout } from '../utils/auth'

export default {
	data: function() {
		return {
			active: 'newPlan'
		}
	},
	computed: {
		nickname() {
			return this.$store.state.user.nickname
		}
	},
	methods: {
		logout() {
			// Logout the current user
			logout().catch((err) => {
				alert('에러가 발생했습니다. 다시 시도해주세요.')
			})
		},
		routerPush(pageName) {
			if (this.$route.name != pageName) this.$router.push({ name: pageName })
		}
	}
}
</script>

<style scoped>
h3 {
	cursor: pointer;
}

.vs-navbar {
	font-family: 'Poppins', sans-serif;
}

.vs-navbar button {
	font-family: 'Poppins', sans-serif;
}

.nickname {
	margin-right: 0.5rem;
}
</style>
