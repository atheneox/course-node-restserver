const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateFileUpload } = require('../middlewares');
const { loadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');


const router = Router();

router.post('/', validateFileUpload, loadFile);

router.put('/:collection/:id', [
    validateFileUpload,
    check('id', 'The id must be from mongo').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], updateImageCloudinary)
// ], actualizarImagen )

router.get('/:collection/:id', [
    check('id', 'The id must be from mongo').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields
], showImage)


module.exports = router;