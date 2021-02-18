const { Router } = require('express'),
    { check } = require('express-validator'),
    { categoryExistsById } = require('../helpers/db-validators'),
    { validateJWT, validateFields, isAdminRole } = require('../middlewares'),
    { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories'),
    router = Router();

router.get('/', getCategories);

router.get('/:id', [
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields,
], getCategory);

router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    validateFields
], createCategory);

router.put('/:id', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    check('id').custom(categoryExistsById),
    validateFields
], updateCategory);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields,
], deleteCategory);


module.exports = router;