const express = require('express')
const router = express.Router()

router.put('/make', (req, res) => {
	console.log(req.body)

	res.status(200).send('plan make endpoint')
})

module.exports = router
