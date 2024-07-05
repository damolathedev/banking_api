const bcrypt = require('bcrypt')


const compareProperty =async function(data, property){
    const isMatch =await bcrypt.compare(data, property)
    console.log(data, property)
    return isMatch
}

module.exports = compareProperty