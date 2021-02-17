const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {

    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            msg: 'There is no token in the request'
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(id);

        if (!user) {
            return res.status(401).json({
                msg: 'invalid token - user does not exist DB'
            })
        }

        // Verificar si el uid tiene estado true
        if (!user.status) {
            return res.status(401).json({
                msg: 'Invalid token - user with status: false'
            })
        }

        req.user = user;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

const validateRefreshToken = async (req = request, res = response, next) => {

    const refresh_token = req.header('refresh_token');

    if (!refresh_token) {
        return res.status(401).json({
            msg: 'There is no token in the request'
        });
    }

    try {
        const { id } = jwt.verify(refresh_token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(id);

        if (!user) {
            return res.status(401).json({
                msg: 'invalid token - user does not exist DB'
            })
        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'Invalid token - user with status: false'
            })
        }

        req.user = user;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}


module.exports = {
    validateJWT,
    validateRefreshToken
}