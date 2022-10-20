// Bring in the express server and create application
let express = require('express');
let app = express();
let pieRepo = require('./repos/pieRepo');

//use the express router object
let router = express.Router();

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

// Configure router so all routes are prefixed with /api/v1
app.use('/api/', router);

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



//create server to listen on port 5000
var server = app.listen(5000, function(){
    console.log('Node server is running on http://localhost:5000')
})