const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory } = require('../controllers/categories');
const { categoryExistsById } = require('../helpers/db-validators');
const { update } = require('../models/user');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields,
], getCategory);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    validateFields
], createCategory);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    check('id').custom(categoryExistsById),
    validateFields
], updateCategory);

// Borrar una categoria - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a valid Mongo id').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields,
], deleteCategory);


module.exports = router;