const express = require('express')
const router = express.Router()

const User = require('../models/User')

// Get user
router.get('/', (req, res) => {
	if (req.query.name) {
		User.findOne({ where: { name: req.query.name } })
			.then((user) => {
				res.json(user)
			})
			.catch((error) => {
				console.error(error)
				res.send(error)
			})
	} else {
		User.findAll()
			.then((users) => {
				res.json(users)
			})
			.catch((error) => {
				console.error(error)
				res.send(error)
			})
	}
})

// Registration
router.post('/', async (req, res) => {
	// Check if the requested info is valid
	const userInfo = req.body
	if (userInfo.name.length < 4) {
		return res.json({ success: false, message: '아이디는 4자 이상이어야 합니다.' })
	}
	if (userInfo.password.length < 5) {
		return res.json({ success: false, message: '비밀번호는 5자 이상이어야 합니다.' })
	}
	if (!userInfo.nickname) {
		return res.json({ success: false, message: '닉네임을 입력해야 합니다.' })
	}

	// Check if the username already exists
	const user = await User.findOne({ where: { name: userInfo.name } })
	if (user) {
		// User already exists
		return res.json({ success: false, message: '이미 존재하는 아이디입니다.' })
	} else {
		// User not exists. Make a new user
		try {
			User.create(userInfo)

			return res.json({ success: true })
		} catch {
			return res.json({ success: false, message: '회원정보 등록에 실패했습니다.' })
		}
	}
})

module.exports = router
