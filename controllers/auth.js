const { response } = require('express');
const bcryptjs = require('bcryptjs')

const User = require('../models/user');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'User / Password is not correct - email'
            });
        }

        // SI el usuario está activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'User / Password is not correct - status: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'User / Password is not correct - password'
            });
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error)
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
            // Tengo que crearlo
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

        // Si el usuario en DB
        if (!user.status) {
            return res.status(401).json({
                msg: 'talk to the administrator, user blocked'
            });
        }

        // Generar el JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {

        res.status(400).json({
            msg: 'google token is not valid'
        })

    }

}


module.exports = {
    login,
    googleSignin
}
