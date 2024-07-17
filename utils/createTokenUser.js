const createTokenUser = (user)=>{
    return {name: user.email, userId: user._id}
}

module.exports = createTokenUser