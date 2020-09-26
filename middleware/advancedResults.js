const advancedResults = (model, populate) => async (req, res, next) => {

    //Declaring a query variable
    let query;

    //Copying req.query
    reqQuery = { ...req.query };

    //Fields to execute
    const removeQuery = ['select', 'sort', 'limit', 'page'];

    //Removing query from the url
    removeQuery.forEach(param => delete reqQuery[param]);


    //Converting to query form
    let queryStr = JSON.stringify(reqQuery);

    //Including operator like gt,gte etc
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding the specified resource from the database
    query = model.find(JSON.parse(queryStr));

    //Select operator finding 
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        // console.log(fields)
        query = query.select(fields);
        //console.log(query);

    }

    //Sort function
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt')
    }

    //Checking populate
    if (populate) {
        query = query.populate(populate);
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    //Adding skipping for showing number of entries from a page
    query = query.skip(startIndex).limit(limit);

    const pagination = {};

    //Pagination showing as request
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit
        }
    }


    //Executing the function from database
    const result = await query;

    res.advancedResults = {
        success: true,
        pagination,
        count: result.length,
        data: result
    };

    next();
}
module.exports = advancedResults;