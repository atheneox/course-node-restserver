const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'rol is required']
    }
});


module.exports = model('Role', RoleSchema);