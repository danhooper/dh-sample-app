var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var _ = require('lodash');
var models = require('./models/config');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017');

var router = express.Router();

router.get('/', function(req, res) {
    res.send('Hello World!');
});

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    next(); // make sure we go to the next routes and don't stop here
});

router.use(function(req, res, next) {
    console.log('start');
    next();
});

var create = function(model, req, res, next) {
    var newEntity = new model(); // create a new instance of the Bear model
    _.assign(newEntity, req.body);

    // save the bear and check for errors
    newEntity.save(function(err) {
        if (err) {
            res.send(err);
        }

        res.json(newEntity);
        next();
    });
};

var getAll = function(model, req, res, next) {
    model.find(function(err, entities) {
        if (err)
            res.send(err);

        res.json(entities);
        next();
    });
};
var getOne = function(model, req, res, next) {
    model.findById(req.params.id, function(err, entity) {
        if (err)
            res.send(err);
        res.json(entity);
        next();
    });
};

var updateOne = function(model, req, res, next) {
    // use our entitiy model to find the entitiy we want
    model.findById(req.params.id, function(err, entity) {

        if (err)
            res.send(err);

        _.assign(entity, req.body);

        // save the entitiy
        entity.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'model updated!'
            });
        });
        next();

    });
};

var deleteOne = function(model, req, res, next) {
    model.remove({
        _id: req.params.id
    }, function(err, entity) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
        next();
    });
};

_.each(models, function(value, key) {
    var modelPost = _.bind(create, null, value.model);
    var modelGet = _.bind(getAll, null, value.model);
    var modelGetIndiv = _.bind(getOne, null, value.model);
    var modelPut = _.bind(updateOne, null, value.model);
    var modelDelete = _.bind(deleteOne, null, value.model);
    router.route('/' + value.url).post(modelPost).get(modelGet);
    router.route('/' + value.url + '/:id').get(modelGetIndiv).put(modelPut).delete(modelDelete);
    var historyGet = _.bind(getAll, null, value.model.historyModel());
    router.route('/' + value.url + '/:id/history').get(historyGet);
});
router.use(function(req, res, next) {
    console.log(req.method, req.originalUrl);
    next();
});

app.use('/api', router);

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
