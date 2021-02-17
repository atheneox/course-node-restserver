const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { emailExists} = require('../helpers/db-validators');

const { login, googleSignin, refresh, register } = require('../controllers/auth');

const { validateRefreshToken } = require('../middlewares');

const router = Router();

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
    // check('refresh_token', 'El id_token es necesario').not().isEmpty(),
    // validateFields
], refresh);


module.exports = router;