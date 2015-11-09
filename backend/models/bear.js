var mongooseHistory = require('mongoose-history');
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BearSchema   = new Schema({
    name: String
});
BearSchema.plugin(mongooseHistory);

module.exports = mongoose.model('Bear', BearSchema);
