const { Router } = require('express'),
    { search } = require('../controllers/search'),
    router = Router();


router.get('/:collection/:term', search)


module.exports = router;