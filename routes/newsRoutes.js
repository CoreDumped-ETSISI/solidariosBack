'use strict'

const express = require ('express')
const router = express.Router()

const newsController = require ('../controllers/newsController')

router.get('/',newsController.getAllNews)
router.get('/:idNews',newsController.getNews)
router.post('/',newsController.createNews)
router.delete('/:idNews',newsController.deleteNews)


module.exports = router
