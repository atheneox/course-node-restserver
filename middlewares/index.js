const validateFields = require('../middlewares/validate-fields'),
    validateJWT = require('../middlewares/validate-jwt'),
    validateRoles = require('../middlewares/validate-roles'),
    validateFileUpload = require('../middlewares/validate-file');

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
    ...validateFileUpload
}