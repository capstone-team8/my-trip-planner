<template>
	<div>
		<my-navbar />
		<router-view />
	</div>
</template>

<script>
import Navbar from '../components/Navbar'
import { getAuth } from '../utils/auth'

export default {
	components: {
		myNavbar: Navbar
	},
	created() {
		getAuth().then((res) => {
			if (res.isAuth) {
				// Logined user
				// Go to NewPlan page
				if (this.$route.path == '/') this.$router.push({ name: 'NewPlan' })
			} else {
				// Not logined
				// Go to Login page
				this.$router.replace({ name: 'Login' })
			}
		})
	}
}
</script>

<style scoped></style>
