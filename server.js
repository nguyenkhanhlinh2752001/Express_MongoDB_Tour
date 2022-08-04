const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
const app = require('./app')


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(con => {
        console.log('DB connection successfully 💚🌹👏')
    })


const PORT = process.env.PORT || 5000
app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT} 😘 💯 ✅`)
})