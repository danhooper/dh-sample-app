var elasticsearch = require('elasticsearch');
var express = require('express');
var bodyParser = require('body-parser');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
client.indices.create({index: 'myindex'});

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var router = express.Router();

router.get('/player', function(req, res) {

  client.search({
    index: 'myindex',
  }).then(function(response) {
    console.log(arguments);
    res.send(response);
  });
});

router.get('/player/:id', function(req, res) {

  client.get({
    index: 'myindex',
    type: 'player',
    id: req.params.id
  }).then(function(response) {
    console.log(arguments);
    res.send(response);
  });
});

router.post('/player', function(req, res) {
  client.create({
    index: 'myindex',
    type: 'player',
    body: req.body
  }).then(function(response) {
    console.log(arguments);
    res.send(response);
  });

});

app.use('/api', router);

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

