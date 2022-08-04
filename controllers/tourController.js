const fs = require('fs')
const Tour = require('../models/tourModel')

exports.getAllTours = async(req, res) => {
    try {
        // Build query string
        // 1A) Simple filtering
        // Ex: http://localhost:5000/tours?price=1000
        const queryObj = {...req.query }
        console.log(queryObj)
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])
            // const query = Tour.find(queryObj)

        //1B) Advanced filtering
        //Ex: http://localhost:5000/tours?price[gte]=1000
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${ match }`)
        console.log(JSON.parse(queryStr));
        let query = Tour.find(JSON.parse(queryStr))

        // 2) Sorting
        // Ex: http://localhost:5000/tours?sort=price
        // Ex: http://localhost:5000/tours?sort=-price,-duration
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            console.log(sortBy)
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createAt')
        }

        // 3) Fields limiting (only choose specific fields or choose all fields except for some fields)
        // Ex: http://localhost:5000/tours?fields=name,duration,difficulty
        // Ex: http://localhost:5000/tours?fields=-name,-duration
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        // 4) Pagination
        // Ex: http://localhost:5000/tours?page=3&limit=3
        // Ex: http://localhost:5000/tours?page=2&limit=10
        // Mean page number 2 and limit 10 records per page
        // 1-10: page 1 ; 11-20: page 2 ; 21-30: page 3 
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 10
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)

        if (req.query.page) {
            const numTours = await Tour.countDocuments()
            if (page > Math.ceil(numTours / limit))
                throw new Error('This page does not exist')
        }

        // Execute query
        const tours = await query

        // Send response
        res.status(200).json({
            status: 'success',
            totalResults: tours.length,
            data: { tours }
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }
}

exports.getTour = async(req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: { tour }
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }
}

exports.createTour = async(req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: { tour: newTour }
        })
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error
        })
    }

}

exports.updateTour = async(req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true
        })
        res.status(200).json({
            status: 'success',
            data: { tour }
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }

}

exports.deleteTour = async(req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }
}