const express = require('express');

const { getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getSingleBootcamp } = require('../controller/bootcamps');
const router = express.Router();

router.route('/').get(getBootcamp).post(createBootcamp);
router.route('/:id').get(getSingleBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;