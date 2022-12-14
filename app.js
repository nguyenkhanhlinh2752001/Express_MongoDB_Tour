const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes.js')
const userRouter = require('./routes/userRoutes.js')

const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())

app.use((req, res, next) => {
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})
app.use('/tours', tourRouter)
app.use('/users', userRouter)

module.exports = app