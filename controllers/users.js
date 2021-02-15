const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const User = require('../models/user');


const getUsers = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        users
    });
}

const postUsers = async (req, res = response) => {

    const { name, email, password, rol } = req.body;
    const user = new User({ name, email, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await user.save();

    res.json({
        user
    });

}

const putUsers = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);

    res.json(user);
}

const patchUsers = (req, res = response) => {
    res.json({
        msg: 'patch API - patchUsers'
    });
}

const deleteUsers = async (req, res = response) => {

    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { status: false });

    res.json(user);

}


module.exports = {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers,
}