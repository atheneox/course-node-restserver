const { Router } = require('express'),
    { check } = require('express-validator'),
    { emailExists } = require('../helpers/db-validators'),
    { validateFields } = require('../middlewares/validate-fields'),
    { validateRefreshToken, validateJWT } = require('../middlewares'),
    { login, googleSignin, refresh, register, changePassword } = require('../controllers/auth'),
    router = Router();


router.post('/login', [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'id_token is required').not().isEmpty(),
    validateFields
], googleSignin);

router.post('/register', [
    check('email').custom(emailExists),
    check('email', 'email is required').isEmail(),
    check('name', 'name is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),
    validateFields
], register);

router.post('/refresh', [
    validateRefreshToken
], refresh);

router.post('/changepassword', [
    validateJWT
], changePassword);


module.exports = router;