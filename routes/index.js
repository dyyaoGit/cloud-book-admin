const express = require('express');
const router = express.Router();
const {addBook, getBook, getBookById, getBookByType} = require('../controller/book')
// const category = require('../controller/category')
// const swiper = require('../controller/swiper')
// const titles = require('../controller/title')
// const article = require('../controller/article')
// const user = require('../controller/user')
// const collection = require('../controller/bookCollection')
// const readList = require('../controller/readList')

router.post('/book', addBook)
router.get('/book', getBook)
router.get('/book/:id', getBookById)

module.exports = router;
