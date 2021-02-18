const { Router } = require('express'),
    { check } = require('express-validator'),
    { validateFields, validateFileUpload } = require('../middlewares'),
    { loadFile, showImage, updateImageCloudinary } = require('../controllers/uploads'),
    { allowedCollections } = require('../helpers'),
    router = Router();

router.post('/', validateFileUpload, loadFile);

router.put('/:collection/:id', [
    validateFileUpload,
    check('id', 'The id must be from mongo').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], updateImageCloudinary)

router.get('/:collection/:id', [
    check('id', 'The id must be from mongo').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], showImage)


module.exports = router;