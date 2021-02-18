const { response } = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: {
                    code: 400,
                    msg: 'User / Password is not correct - email'
                }
            });
        }

        if (!user.status) {
            return res.status(400).json({
                status: {
                    code: 400,
                    msg: 'User / Password is not correct - status: false'
                }
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                status: {
                    code: 400,
                    msg: 'User / Password is not correct - password'
                }
            });
        }

        const body = generateJWT(user);

        res.json({
            status: {
                code: 200,
                msg: 'get token successfully'
            },
            body
        });

    } catch (error) {
        res.status(500).json({
            msg: 'talk to the administrator'
        });
    }

}

const googleSignin = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        const { email, name, img } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {

            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            };

            user = new User(data);
            await user.save();

        }

        if (!user.status) {
            return res.status(401).json({
                msg: 'talk to the administrator, user blocked'
            });
        }

        const body = generateJWT(user);

        res.json({
            status: {
                code: 200,
                msg: 'get token successfully'
            },
            body
        });

    } catch (error) {

        res.status(400).json({
            msg: 'google token is not valid'
        })

    }

}

const refresh = async (req, res = response) => {

    const refresh_token = req.header('refresh_token');
    const { id } = jwt.verify(refresh_token, process.env.SECRETORPRIVATEKEY);

    try {

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                msg: 'User / Password is not correct - email'
            });
        }

        if (!user.status) {
            return res.status(400).json({
                msg: 'User / Password is not correct - status: false'
            });
        }

        const body = generateJWT(user);

        res.json({
            status: {
                code: 200,
                msg: 'updated token'
            },
            body
        });

    } catch (error) {
        res.status(500).json({
            msg: 'talk to the administrator'
        });
    }

}

const register = async (req, res = response) => {

    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

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

const changePassword = async (req, res = response) => {

    const { new_password } = req.body;
    const id = req.user.id;
    const user = await User.findById(id);
    const salt = bcryptjs.genSaltSync();
    
    user.password = bcryptjs.hashSync(new_password, salt);

    await user.save();

    res.status(201).json({
        status: {
            code: 201,
            msg: 'password changed successfully'
        },
        body: {
            user
        }
    });

}


module.exports = {
    login,
    googleSignin,
    refresh,
    register,
    changePassword
}