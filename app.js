require('dotenv').config()
const express = require('express')
const app = express()

// database
const conectDB = require('./db/connectDB')

// routes
const userRoute = require('./routes/userRoute')



//
app.use('/api/v1', userRoute)


app.get('/', (req, res)=>{
    res.send('Bank api')
})

const port = process.env.PORT || 5000

const start= async()=>{
    try {
        await conectDB(process.env.MONGOOSE_URI)
        app.listen(port, ()=>{
            console.log(`server is listening on port ${port}...`);
        })  
    } catch (error) {
        console.log(error);
    }
}

start()