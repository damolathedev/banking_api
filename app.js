require('dotenv').config()
require('express-async-errors')

// express
const express = require('express')
const app = express()
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

// database
const conectDB = require('./db/connectDB')

// routes
const userRoute = require('./routes/userRoute')

//middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlingMiddleware = require('./middleware/error-handler')


app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(morgan('tiny'))

//
app.use('/api/v1', userRoute)

app.use(notFoundMiddleware)
app.use(errorHandlingMiddleware)

app.get('/', (req, res)=>{
    res.send('Bank api')
})

const port = process.env.PORT || 8080 || 3000

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