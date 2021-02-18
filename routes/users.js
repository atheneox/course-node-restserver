
const { Router } = require('express'),
    { check } = require('express-validator'),
    { isRoleValid, emailExists, userExistsById } = require('../helpers/db-validators'),
    { validateFields, validateJWT, isAdminRole, hasRole } = require('../middlewares'),
    { getUsers, putUsers, postUsers, deleteUsers, patchUsers } = require('../controllers/users'),
    router = Router();


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
    check('rol').custom(isRoleValid),
    validateFields
], postUsers);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    hasRole('ADMIN_ROLE', 'SELLER_ROLE'),
    check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], deleteUsers);

router.patch('/', patchUsers);


module.exports = router;