const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

const app = require('./app')
const PORT = process.env.PORT || 5000

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT} 😘 💯 ✅`)
})