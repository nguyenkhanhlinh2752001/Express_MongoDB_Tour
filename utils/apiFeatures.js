// More advanced API
// Get top 5 biggest price records : http://localhost:5000/tours?limit=5&sort=-price
// Get top 3 smallest duration records : http://localhost:5000/tours?limit=3&sort=duration,ratingsAverage
// http://localhost:5000/tours?price[gte]=1000&duration[lt]=7&fields=name,sumary

class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        // A) Simple filtering
        // Ex: http://localhost:5000/tours?price=1000
        const queryObj = {...this.queryString }
            // queryString=req.query
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])
            // const query = Tour.find(queryObj)

        // B) Advanced filtering
        // Ex: http://localhost:5000/tours?price[gte]=1000
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${ match }`)
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    sort() {
        // Ex: http://localhost:5000/tours?sort=price
        // Ex: http://localhost:5000/tours?sort=-price,-duration
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createAt')
        }
        return this
    }

    limitFields() {
        // Fields limiting (only choose specific fields or choose all fields except for some fields)
        // Ex: http://localhost:5000/tours?fields=name,duration,difficulty
        // Ex: http://localhost:5000/tours?fields=-name,-duration
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        // Ex: http://localhost:5000/tours?page=3&limit=3
        // Ex: http://localhost:5000/tours?page=2&limit=10
        // Mean page number 2 and limit 10 records per page
        // 1-10: page 1 ; 11-20: page 2 ; 21-30: page 3 
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 10
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}
module.exports = APIFeatures