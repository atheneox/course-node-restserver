const { response } = require('express')


const isAdminRole = ( req, res = response, next ) => {

    if ( !req.user ) {
        return res.status(500).json({
            msg: 'you want to verify the role without validating the token first'
        });
    }

    const { rol, name } = req.user;
    
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${ name } not an administrator - Can't do this`
        });
    }

    next();
}

const hasRole = ( ...roles  ) => {
    return (req, res = response, next) => {
        
        if ( !req.user ) {
            return res.status(500).json({
                msg: 'You want to verify the role without validating the token first'
            });
        }

        if ( !roles.includes( req.user.rol ) ) {
            return res.status(401).json({
                msg: `The service requires one of these roles ${ roles }`
            });
        }


        next();
    }
}


module.exports = {
    isAdminRole,
    hasRole
}