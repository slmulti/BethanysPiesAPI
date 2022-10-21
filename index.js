// Bring in the express server and create application
const { application } = require('express');
let express = require('express');
let app = express();
let pieRepo = require('./repos/pieRepo');
let errorHelpers = require('./helpers/errorHelpers');

//Use the express router object
let router = express.Router();

//configure middleware to support JSON data parsing in request object
app.use(express.json());

// create GET top return a list of all pies
router.get('/', function (req, res, next) {
    pieRepo.get(function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "All pies retrieved.",
            "data": data
        });
    }, function (err){
        next(err);
    })
});

// Create GET/search?id=m&name=str to search for pie by 'id' and/or 'name'
router.get('/search', function (req, res, next) {
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };

    pieRepo.search(searchObject, function(data){
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "All pies retrieved.",
            "data": data
        });
    }, function(err){
        next(err);
    })
})

// Create GET/id to return a single pie
router.get('/:id', function (req, res, next){
    pieRepo.getById(req.params.id, function (data) {
        if (data) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "Single pies retrieved.",
                "data": data
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."
                }
            })
        }
    }, function(err){
        next(err);
    });
});

router.post('/', function (req, res, next) {
    pieRepo.insert(req.body, function(data) {
        res.status(201).json({
            "status": 201,
            "statusText": "Created",
            "message": "New Pie Added",
            "data": data
        });
    }, function(err){
        next(err);
    });
})

router.put('/:id', function (req, res, next) {
    pieRepo.getById(req.params.id, function(data){
        if (data) {
            //attempt to update the data
            pieRepo.update(req.body, req.params.id, function(data){
                res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "Pie '" + req.params.id + "' updated.",
                "data": data
                });
            });
        }
        else{
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."
                    }
                });
            }
        }, function(err){
    next(err);
    });
})

router.delete('/:id', function(req, res, next){
    pieRepo.getById(req.params.id, function(data){
        if (data) {
            //attempt to delete the data
            pieRepo.delete(req.params.id, function(data){
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "Pie '" + req.params.id + "' is deleted.",
                    "data": "Pie '" + req.params.id + "' deleted."
                });
            });
        }
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not Found",
                "message": "The pie '" + req.params.id + "' could not be found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."
                    }
                });
            }
        }, function(err){
            next(err);
    });
})

router.patch('/:id', function (req, res, next) {
    pieRepo.getById(req.params.id, function (data){
        if (data){
            //attempt to update data
            pieRepo.update(req.body, req.params.id, function(data){
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": "Pie '" + req.params.id + "' patched.",
                    "data": data
                    });
                });
            }
            else {
                res.status(404).send({
                    "status": 404,
                    "statusText": "Not Found",
                    "message": "The pie '" + req.params.id + "' could not be found.",
                    "error": {
                    "code": "NOT_FOUND",
                    "message": "The pie '" + req.params.id + "' could not be found."
                        }
                    });
                }
            }, function (err) {
                next(err);
    });
})

// Configure router so all routes are prefixed with /api/v1
app.use('/api/', router);

//configure exception logger to console
app.use(errorHelpers.logErrorsToConsole);
//configure exception logger to file
app.use(errorHelpers.logErrorsToFile);
//Configure client error handler
app.use(errorHelpers.clientErrorHandler);
//Configure catchall exceptiom middleware last
app.use(errorHelpers.errorHandler);

//create server to listen on port 5000
var server = app.listen(5000, function(){
    console.log('Node server is running on http://localhost:5000')
})