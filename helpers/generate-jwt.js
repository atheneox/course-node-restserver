
const jwt = require('jsonwebtoken');

const generateJWT = (user = '') => {

    var payload_access_token = {
        id: user.id,
        iss: "myservice@biencuidao.app",
        iat: Date.now(),
        aud: "biencuidao.app",
        exp: Date.now() + 1000 * 60 * 60 * 12,
        sub: "myservice@biencuidao.app"
    };

    var payload_refresh_token = {
        id: user.id,
        iss: "myservice@biencuidao.app",
        iat: Date.now(),
        aud: "biencuidao.app",
        exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
        sub: "myservice@biencuidao.app"
    };

    jwtConfig = {
        jwtSecret: process.env.SECRETORPRIVATEKEY,
        jwtSession: {
            session: false
        }
    }

    const access_token = jwt.sign(payload_access_token, jwtConfig.jwtSecret);
    const refresh_token = jwt.sign(payload_refresh_token, jwtConfig.jwtSecret);

    return res = {
        access_token,
        refresh_token,
        user
    }

}


module.exports = {
    generateJWT
}