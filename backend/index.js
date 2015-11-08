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
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

var post = function(model, req, res) {
    var newEntity = new model(); // create a new instance of the Bear model
    _.assign(newEntity, req.body);

    // save the bear and check for errors
    newEntity.save(function(err) {
        if (err) {
            res.send(err);
        }

        res.json(newEntity);
    });
};

var get = function(model, req, res) {
    model.find(function(err, entities) {
        if (err)
            res.send(err);

        res.json(entities);
    });
};
var getSpecific = function(model, req, res) {
    model.findById(req.params.id, function(err, entity) {
        if (err)
            res.send(err);
        res.json(entity);
    });
};

var putSpecific = function(model, req, res) {

    // use our entitiy model to find the entitiy we want
    model.findById(req.params.entitiy_id, function(err, entitiy) {

        if (err)
            res.send(err);

        entitiy.name = req.body.name; // update the entitiys info

        // save the entitiy
        entitiy.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'model updated!'
            });
        });

    });
};

var deleteSpecific = function(req, res) {
    Bear.remove({
        _id: req.params.bear_id
    }, function(err, bear) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
};

_.each(models, function(value, key) {
    var modelPost = _.bind(post, null, value.model);
    var modelGet = _.bind(get, null, value.model);
    var modelGetIndiv = _.bind(getSpecific, null, value.model);
    var modelPut = _.bind(putSpecific, null, value.model);
    var modelDelete = _.bind(deleteSpecific, null, value.model);
    router.route('/' + value.url).post(modelPost).get(modelGet);
    router.route('/bear/:id').get(modelGetIndiv, modelPut, modelDelete);
});

app.use('/api', router);

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
