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

    res.status(200).json(
        {
            status: {
                code: 200,
                msg: 'users found correctly'
            },
            body: {
                total,
                users
            }
        }
    );

}

const postUsers = async (req, res = response) => {

    const { name, email, password, rol } = req.body;
    const user = new User({ name, email, password, rol });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.status(201).json({
        status: {
            code: 201,
            msg: 'user created successfully'
        },
        body: {
            user
        }
    });

}

const putUsers = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest, { new: true });

    res.status(200).json({
        status: {
            code: 200,
            msg: 'user updated successfully'
        },
        body: {
            user
        }
    });

}

const patchUsers = (req, res = response) => {
    res.json({
        status: {
            code: 200,
            msg: 'patch API - patchUsers'
        }
    });
}

const deleteUsers = async (req, res = response) => {

    const { id } = req.params;

    const userExists = await User.findOne({ _id: id, status: false });

    if (userExists) {
        res.status(404).json({
            status: {
                code: 404,
                msg: 'user not found'
            }
        });
    }

    const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });

    res.status(200).json(
        {
            status: {
                code: 200,
                msg: 'user removed successfully'
            },
            body: {
                user
            }
        }
    );

}


module.exports = {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers,
}