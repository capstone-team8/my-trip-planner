const express = require('express')
const router = express.Router()

// 일정 생성 엔드포인트
router.put('/make', (req, res) => {
	console.log(req.body)

	res.status(200).send('plan make response')
})

module.exports = router
