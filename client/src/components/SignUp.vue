<template>
	<div class="center signup-form-container">
		<h2>회원가입</h2>
		<vs-input v-model="username" label="아이디" placeholder="username"> </vs-input>
		<vs-input v-model="password" type="password" label="비밀번호" placeholder="password">
		</vs-input>
		<vs-input
			v-model="passwordConfirm"
			type="password"
			label="비밀번호 확인"
			placeholder="password"
		>
			<template v-if="isPasswordSame && password.length" #message-success>
				비밀번호가 일치합니다.
			</template>
			<template v-if="!isPasswordSame && passwordConfirm.length" #message-danger>
				비밀번호가 일치하지 않습니다.
			</template>
		</vs-input>
		<vs-input v-model="nickname" class="my-input-nickname" label="닉네임" placeholder="홍길동">
		</vs-input>
		<vs-row justify="flex-end">
			<vs-button @click="signUp" flat :active="true">
				회원가입
			</vs-button>
		</vs-row>
	</div>
</template>

<script>
import { signUp } from '../utils/auth'

export default {
	data: function() {
		return {
			username: '',
			password: '',
			passwordConfirm: '',
			nickname: ''
		}
	},
	computed: {
		isPasswordSame: function() {
			return this.password == this.passwordConfirm
		}
	},
	methods: {
		signUp() {
			if (this.username && this.password && this.passwordConfirm && this.nickname) {
				if (!this.isPasswordSame) {
					alert('비밀번호가 일치하지 않습니다.')
				} else {
					// Send the register request to the server
					this.signUpRequest()
				}
			} else {
				alert('모든 항목을 입력해주세요.')
			}
		},
		signUpRequest() {
			signUp(this.username, this.password, this.nickname)
				.then((res) => {
					if (res.success) {
						alert('회원가입에 성공했습니다.')
						this.$emit('signUpDone')
					} else {
						alert(res.message)
					}
				})
				.catch((err) => {
					alert('오류가 발생했습니다. 다시 시도해주세요.')
				})
		}
	}
}
</script>

<style scoped>
h2 {
	margin-bottom: 2rem;
}
</style>

<style>
.signup-form-container .vs-input-content {
	margin: 1rem 0;
	width: calc(100%);
}

.signup-form-container .vs-input-content .vs-input {
	width: 100%;
}

.signup-form-container input {
	height: 2.5rem;
}

.signup-form-container .vs-input__message {
	text-align: left;
	/* margin-bottom: 1.5rem; */
}

.signup-form-container .my-input-nickname {
	margin-top: 2rem;
}
</style>
