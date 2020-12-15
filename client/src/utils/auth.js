import axios from 'axios'

import router from '../router'
import { store } from '../store/store'

const endpoint = process.env.VUE_APP_API_DOMAIN

// Get the user info with token
export async function getAuth() {
	try {
		const res = await axios.get(endpoint + '/auth', {
			withCredentials: true
		})

		if (res.data.isAuth) {
			// Auth user
			// Store the user state
			store.state.user.id = res.data.userId
			store.state.user.name = res.data.username
			store.state.user.nickname = res.data.nickname
		}
		return res.data
	} catch (err) {
		console.error(err)
		throw err
	}
}

// User login
export async function login(username, password) {
	try {
		const res = await axios.post(endpoint + '/auth/login', {
			username: username,
			password: password
		})

		if (res.data.success) {
			// Login success
			// Store the token and user state
			$cookies.set('x_auth', res.data.x_auth)
			store.state.user.id = res.data.userId
			store.state.user.name = res.data.username
			store.state.user.nickname = res.data.nickname

			return { success: true }
		} else {
			// Login fail
			return { success: false, message: res.data.message }
		}
	} catch (err) {
		console.error(err)
		throw err
	}
}

// User logout
export async function logout() {
	try {
		const res = await axios.get(endpoint + '/auth/logout', {
			withCredentials: true
		})

		if (res.data.success) {
			// Logout success
			// Reset the cookie and the user state
			$cookies.remove('x_auth')
			store.state.user.id = undefined
			store.state.user.name = undefined
			store.state.user.nickname = undefined

			router.replace({ name: 'Login' })
		} else {
			alert('로그아웃 실패')
		}
	} catch (err) {
		console.error(err)
		throw err
	}
}

// User registration
export async function signUp(username, password, nickname) {
	try {
		const res = await axios.post(endpoint + '/user', {
			name: username,
			password: password,
			nickname: nickname
		})

		return res.data
	} catch(err) {
		console.error(err)
		throw err
	}
}
