const fs = require('fs')
const Tour = require('../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')

exports.aliasTopTours = async(req, res, next) => {
    req.query.limit = '5'
    req.query.sort = 'price,-ratingsAverage,'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

exports.getAllTours = async(req, res) => {
    try {
        // Some advanced APIs
        // Get top 5 biggest price records : http://localhost:5000/tours?limit=5&sort=-price
        // Get top 3 smallest duration records : http://localhost:5000/tours?limit=3&sort=duration,ratingsAverage
        // http://localhost:5000/tours?price[gte]=1000&duration[lt]=7&fields=name,sumary

        // Execute query
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
        const tours = await features.query

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

exports.getTourStats = async(req, res) => {
    try {
        const stats = await Tour.aggregate([{
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                // 1: ascending
                $sort: { avgPrice: 1 }
            },
            // {
            //     // ne: not equal
            //     $match: { _id: { $ne: 'EASY' } }
            // }
        ])
        res.status(200).json({
            status: 'success',
            data: { stats }
        })
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: error
        })
    }
}