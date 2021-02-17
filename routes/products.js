const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct } = require('../controllers/products');

const { categoryExistsById, productExistsById } = require('../helpers/db-validators');

const router = Router();

router.get('/', [validateJWT], getProducts);

router.get('/:id', [
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(productExistsById),
    validateFields,
], getProduct);

router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    check('category', 'Not a valid Mongo id').isMongoId(),
    check('category').custom(categoryExistsById),
    validateFields
], createProduct);

router.put('/:id', [
    validateJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom(productExistsById),
    validateFields
], updateProduct);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(productExistsById),
    validateFields,
], deleteProduct);


module.exports = router;