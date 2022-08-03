const e = require('express')
const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours }
    })
})

// 4xx: Client Error (Lỗi Client)
// 404 Not Found: Các tài nguyên hiện tại không được tìm thấy
app.get('/tours/:id', (req, res) => {
    console.log(req.params)
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)

    if (!tour)
        return res
            .status(404)
            .json({ status: 'fail', message: 'Invalid ID' })

    res.status(200).json({
        status: 'success',
        data: { tour }
    })
})

// 201 Created: Request đã được xử lý, kết quả của việc xử lý tạo ra một resource mới.
app.post('/tours', (req, res) => {
    console.log(req.body)
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId }, req.body)
    tours.push(newTour)
    fs.writeFile(`${ __dirname }/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
})

const PORT = 5000

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT} 😘 💯 ✅`)
})