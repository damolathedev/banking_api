const createTokenUser = (user)=>{
    return {name: user.fullName, userId: user._id}
}

module.exports = createTokenUser