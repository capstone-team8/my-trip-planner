<template>
	<div class="center">
		<div class="my-padding"></div>
		<h1>My Trip Planner</h1>
		<div class="grid">
			<vs-row justify="center">
				<vs-col w="4" sm="8" xs="11" class="container login-form-container">
					<vs-input @keyup.enter="login" v-model="username" placeholder="아이디">
						<template #icon>
							<i class="bx bx-user" />
						</template>
					</vs-input>
					<vs-input @keyup.enter="login" type="password" v-model="password" placeholder="비밀번호">
						<template #icon>
							<i class="bx bx-lock" />
						</template>
					</vs-input>
					<vs-button @click="login" class="my-login-button" block flat :active="true">
						로그인
					</vs-button>
					<vs-row class="my-new-account" justify="flex-end">
						<p @click="isSignupDialog = true">회원 가입</p>
					</vs-row>
				</vs-col>
			</vs-row>
		</div>
		<vs-dialog prevent-close v-model="isSignupDialog">
			<my-sign-up @signUpDone="signUpDoneHandler" />
		</vs-dialog>
	</div>
</template>

<script>
import SignUp from '../components/SignUp'
import { login } from '../utils/auth'

export default {
	components: {
		mySignUp: SignUp
	},
	data: function() {
		return {
			username: '',
			password: '',
			isSignupDialog: false
		}
	},
	methods: {
		login() {
			login(this.username, this.password)
				.then((res) => {
					if (res.success) {
						this.$router.replace({ name: 'Home' })
					} else {
						// 로그인 실패
						alert(res.message)
						// 폼 데이터 초기화
						this.username = ''
						this.password = ''
					}
				})
				.catch((err) => {
					alert('오류가 발생했습니다. 다시 시도해주세요.')
				})
		},
		signUpDoneHandler() {
			this.isSignupDialog = false
		}
	}
}
</script>

<style scoped>
.container {
	background-color: white;
	border-radius: 1rem;
	padding: 1rem;
}

.my-padding {
	height: 10em;
}

.my-login-button {
	height: 2.5rem;
}

.my-new-account p {
	margin: 10px 0;
	font-size: 0.8rem;
	color: rgba(var(--vs-text), 0.5);
	cursor: pointer;
}
</style>

<style>
.login-form-container .vs-input-content {
	margin: 10px 0;
	width: calc(100%);
}

.login-form-container .vs-input-content .vs-input {
	width: 100%;
}

.login-form-container input {
	height: 2.5rem;
}
</style>
