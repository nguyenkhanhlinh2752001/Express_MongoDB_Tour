exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'Invalid route'
    })
}


exports.getUser = (req, res) => {
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
}

exports.createUser = (req, res) => {
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
}

exports.updateUser = (req, res) => {
    console.log(req.params)
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here>'
        }
    })
}

exports.deleteUser = (req, res) => {
    console.log(req.params)
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
}