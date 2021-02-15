
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateFields,
    validateJWT,
    isAdminRole,
    hasRole
} = require('../middlewares');


const { isRoleValid, emailExists, userExistsById } = require('../helpers/db-validators');

const { getUsers,
    putUsers,
    postUsers,
    deleteUsers,
    patchUsers } = require('../controllers/users');

const router = Router();


router.get('/', getUsers);

router.put('/:id', [
    check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(userExistsById),
    check('rol').custom(isRoleValid),
    validateFields
], putUsers);

router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('password', 'The password must be more than 6 letters').isLength({ min: 6 }),
    check('email', 'the email is not valid').isEmail(),
    check('email').custom(emailExists),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(isRoleValid),
    validateFields
], postUsers);

router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    hasRole('ADMIN_ROLE', 'VENTAR_ROLE', 'OTRO_ROLE'),
    check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], deleteUsers);

router.patch('/', patchUsers);


module.exports = router;