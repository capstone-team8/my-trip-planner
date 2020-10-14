const express = require('express')
const router = express.Router()

const locationService = require('../services/locationService')

router.get('/search', (req, res) => {
    locationService.search(req.query.text)
    .then((searchResult) => {
        res.status(200).json(searchResult)
    })
    .catch((error) => {
        res.status(400).send(error)
    })
})

module.exports = router
