const customError = require('../error')
const {isTokenValid} = require('../utils')

const authenticateUser = async(req, res, next)=>{
    const token = req.signedCookies.token

    if(!token){
        throw new customError.UnauthenticatedError('Authentication Invalid')
    }

    try {
        const{name, userId} = isTokenValid({token})
        req.user = {name, userId}
        next()
    } catch (error) {
        throw new customError.UnauthenticatedError('Authentication invalid')
    }
}


module.exports = authenticateUser